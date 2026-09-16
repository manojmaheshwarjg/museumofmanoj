// The rooms inside the museum. The lobby, then for every gallery a corridor that turns left, then right, then
// left again, and the room itself: its wall label, framed drawings, Easter eggs and furniture.
// Every room's far wall is kept blank, so the camera can walk into it and hand the screen over to the room's page.

import {
  AdditiveBlending, BoxGeometry, DoubleSide, EdgesGeometry, Group, Mesh, MeshBasicMaterial, NormalBlending,
  PlaneGeometry, TorusGeometry, Vector3,
} from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { ROOMS } from '../content/rooms.js';
import { STRIPS } from '../content/strips.js';
import { EGGS } from '../content/eggs.js';
import { poolTexture } from './textures.js';
import { comicTexture, doorTexture, eggSignTexture, logoTexture, pictureTexture, plantTexture, plateTexture, signTexture } from './decor.js';

export const FLOOR = 0.45;
export const EYE = FLOOR + 1.7;
export const AXIS = -200; // the entrance walks in along z = -200
const LOBBY = { x0: 22.1, x1: 40, half: 7, height: 5.5 };
const HALL = { half: 1.7, height: 3.2, lead: 5, run: 4, turn: 10, off: 4 };
const ROOM = { length: 16, half: 6.5, height: 4.4 };
const DOOR = { half: 1.2, height: 2.7 };
const ARCH = { half: 1.2, height: 2.9 };
const SLOTS = [[-1, 4.5], [1, 4.5], [-1, 8.5], [1, 8.5], [-1, 12.5], [1, 12.5]];

const TONES = {
  paper: { wall: '#EEE9DF', floor: '#E2DDD0', ceiling: '#F4F0E7', frame: '#0E0D0B', ink: '#0E0D0B' },
  night: { wall: '#1A1916', floor: '#121110', ceiling: '#0E0D0B', frame: '#F1EDE3', ink: '#F1EDE3' },
  // The corridor's frames are dark: you meet the back of a panel before its face, and a pale frame there reads as a blank slab.
  hall: { wall: '#161512', floor: '#0F0E0C', ceiling: '#0B0B0A', frame: '#26241F', ink: '#F1EDE3' },
};

// Where everything stands, and the walk that joins it up, for the camera rail and the guide.
export const LAYOUT = (() => {
  const rooms = [];
  const sideOf = (i) => (i % 2 ? 1 : -1);
  let from = { x: LOBBY.x1, z: AXIS + sideOf(0) * HALL.off };
  let z = AXIS;
  ROOMS.forEach((room, i) => {
    const nz = z + sideOf(i) * HALL.turn;
    const corner = from.x + HALL.lead;
    const rx0 = corner + HALL.run;
    const rx1 = rx0 + ROOM.length;
    const arch = { x: rx1, z: nz + sideOf(i + 1) * HALL.off };
    rooms.push({
      id: room.id, z: nz, rx0, rx1, side: sideOf(i), door: { x: rx0, z: nz }, arch,
      path: [{ ...from }, { x: corner, z: from.z }, { x: corner, z: nz }, { x: rx0, z: nz }],
    });
    from = arch;
    z = nz;
  });
  return { lobby: { ...LOBBY, z: AXIS, arch: { x: LOBBY.x1, z: AXIS + sideOf(0) * HALL.off } }, rooms };
})();

// A point a fraction of the way along a walk, measured by distance. Past the end it keeps going straight.
export function pointOn(path, t) {
  const legs = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.z - path[i].z));
  const total = legs.reduce((sum, l) => sum + l, 0);
  let left = t * total;
  for (let i = 0; i < legs.length; i++) {
    if (left <= legs[i] || i === legs.length - 1) {
      const u = legs[i] ? left / legs[i] : 0;
      return { x: path[i].x + (path[i + 1].x - path[i].x) * u, z: path[i].z + (path[i + 1].z - path[i].z) * u };
    }
    left -= legs[i];
  }
  return { ...path[path.length - 1] };
}

const solids = new Map();
const solid = (color) => {
  if (!solids.has(color)) solids.set(color, new MeshBasicMaterial({ color }));
  return solids.get(color);
};

function box(w, h, d, x, y, z, material) {
  const m = new Mesh(new BoxGeometry(Math.max(0.02, w), Math.max(0.02, h), Math.max(0.02, d)), material);
  m.position.set(x, y, z);
  return m;
}

function edgesOf(meshes) {
  const out = [];
  const v = new Vector3();
  meshes.forEach((mesh) => {
    mesh.updateMatrixWorld(true);
    const edges = new EdgesGeometry(mesh.geometry, 20);
    const p = edges.attributes.position;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(mesh.matrixWorld); out.push(v.x, v.y, v.z); }
    edges.dispose();
  });
  return out;
}

function lines(positions, material) {
  const geo = new LineSegmentsGeometry();
  geo.setPositions(positions);
  return new LineSegments2(geo, material);
}

export function buildRooms() {
  const group = new Group();
  const materials = [];
  const segments = [];
  const anchors = {};
  const doors = [];
  const pool = poolTexture();
  const doorFace = new MeshBasicMaterial({ map: doorTexture() });
  const leaf = new MeshBasicMaterial({ map: plantTexture(), transparent: true, alphaTest: 0.4, side: DoubleSide });
  const lampLight = new MeshBasicMaterial({ map: pool, color: '#FFC98A', transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false });
  const inkFor = {};
  const ink = (tone) => {
    if (!inkFor[tone]) {
      inkFor[tone] = new LineMaterial({ color: TONES[tone].ink, linewidth: 1.4, worldUnits: false, transparent: true, opacity: tone === 'paper' ? 0.78 : 0.85 });
      materials.push(inkFor[tone]);
    }
    return inkFor[tone];
  };

  function segment(tone, x, z, reach) {
    const seg = { group: new Group(), tone, inked: [], textures: [], center: new Vector3(x, EYE, z), reach };
    group.add(seg.group);
    segments.push(seg);
    return seg;
  }
  const put = (seg, mesh, inked = true) => { seg.group.add(mesh); if (inked) seg.inked.push(mesh); return mesh; };

  // A room or the lobby: floor, ceiling, four walls, with a way in and a way out.
  function shell(seg, { x0, x1, z, half, height, door, arch, entry }) {
    const p = TONES[seg.tone];
    const len = x1 - x0;
    const cx = (x0 + x1) / 2;
    put(seg, box(len, 0.1, half * 2, cx, FLOOR - 0.05, z, solid(p.floor)));
    put(seg, box(len, 0.1, half * 2, cx, FLOOR + height + 0.05, z, solid(p.ceiling)), false);
    [-1, 1].forEach((side) => put(seg, box(len, height, 0.2, cx, FLOOR + height / 2, z + side * half, solid(p.wall))));
    [[x0, door, entry || p.wall], [x1, arch, p.wall]].forEach(([x, hole, tint]) => {
      const piece = (zA, zB, yA, yB) => {
        if (zB - zA > 0.02 && yB - yA > 0.02) put(seg, box(0.2, yB - yA, zB - zA, x, (yA + yB) / 2, (zA + zB) / 2, solid(tint)));
      };
      if (!hole) piece(z - half, z + half, FLOOR, FLOOR + height);
      else {
        piece(z - half, hole.z - hole.half, FLOOR, FLOOR + height);
        piece(hole.z + hole.half, z + half, FLOOR, FLOOR + height);
        piece(hole.z - hole.half, hole.z + hole.half, FLOOR + hole.height, FLOOR + height);
      }
    });
  }

  // A corridor that follows its walk: three straight legs, with the walls trimmed where it turns.
  function hallway(seg, path, side) {
    const p = TONES.hall;
    const h = HALL.half;
    const [a, b, c, d] = path;
    const wall = (x0, x1, z0, z1) => put(seg, box(Math.abs(x1 - x0), HALL.height, Math.abs(z1 - z0), (x0 + x1) / 2, FLOOR + HALL.height / 2, (z0 + z1) / 2, solid(p.wall)));
    const slab = (x0, x1, z0, z1, y, color, inked) => put(seg, box(Math.abs(x1 - x0), 0.1, Math.abs(z1 - z0), (x0 + x1) / 2, y, (z0 + z1) / 2, solid(color)), inked);
    const lo = Math.min(a.z, c.z) - h;
    const hi = Math.max(a.z, c.z) + h;
    [[FLOOR - 0.05, p.floor, true], [FLOOR + HALL.height + 0.05, p.ceiling, false]].forEach(([y, color, inked]) => {
      slab(a.x, b.x + h, a.z - h, a.z + h, y, color, inked);
      slab(b.x - h, b.x + h, lo, hi, y, color, inked);
      slab(c.x - h, d.x, c.z - h, c.z + h, y, color, inked);
    });
    wall(a.x, b.x - h, a.z + side * h, a.z + side * h);
    wall(a.x, b.x + h, a.z - side * h, a.z - side * h);
    // The turn's two walls stop where the next leg begins: the outer one at that leg's near wall, the inner one at
    // its far wall. Run them the other way round and the outer wall closes off the leg you are about to walk down.
    wall(b.x + h, b.x + h, a.z - side * h, c.z - side * h);
    wall(b.x - h, b.x - h, a.z + side * h, c.z + side * h);
    wall(b.x - h, d.x, c.z + side * h, c.z + side * h);
    wall(b.x + h, d.x, c.z - side * h, c.z - side * h);
    [0.12, 0.31, 0.5, 0.69, 0.88].forEach((t) => {
      const at = pointOn(path, t);
      put(seg, box(0.06, 0.5, 0.06, at.x, FLOOR + HALL.height - 0.25, at.z, solid(p.frame)), false);
      put(seg, box(0.55, 0.16, 0.55, at.x, FLOOR + HALL.height - 0.56, at.z, solid('#FFE9C4')), false);
      const puddle = new Mesh(new PlaneGeometry(3.4, 3.4), lampLight);
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(at.x, FLOOR + 0.02, at.z);
      put(seg, puddle, false);
    });
  }

  // Something flat on a wall. `inward` points into the room, along x or z.
  function hang(seg, { x, z, y, w, h, texture, axis = 'z', inward = 1, framed = true, wash = true }) {
    const p = TONES[seg.tone];
    const nx = axis === 'x' ? inward : 0;
    const nz = axis === 'z' ? inward : 0;
    const turn = axis === 'x' ? inward * (Math.PI / 2) : (inward > 0 ? 0 : Math.PI);
    if (wash) {
      const light = new MeshBasicMaterial({
        map: pool, color: seg.tone === 'paper' ? '#E0A050' : '#FFC98A', transparent: true, depthWrite: false,
        opacity: seg.tone === 'paper' ? 0.2 : 0.5, blending: seg.tone === 'paper' ? NormalBlending : AdditiveBlending,
      });
      const glow = new Mesh(new PlaneGeometry(w * 1.6, h * 1.7), light);
      glow.position.set(x + nx * 0.012, y + h * 0.25, z + nz * 0.012);
      glow.rotation.y = turn;
      put(seg, glow, false);
      const puddle = new Mesh(new PlaneGeometry(w * 1.3, 2.4), light);
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(x + nx * 1.3, FLOOR + 0.02, z + nz * 1.3);
      put(seg, puddle, false);
    }
    if (framed) {
      const thick = axis === 'x' ? [0.05, h + 0.18, w + 0.18] : [w + 0.18, h + 0.18, 0.05];
      put(seg, box(thick[0], thick[1], thick[2], x + nx * 0.03, y, z + nz * 0.03, solid(p.frame)));
    }
    const picture = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ map: texture }));
    picture.position.set(x + nx * 0.062, y, z + nz * 0.062);
    picture.rotation.y = turn;
    put(seg, picture, false);
    if (texture.userData.load) seg.textures.push(texture);
    // The marker sits on the painted "?" tag in the picture's top corner.
    const side = axis === 'x' ? { x: 0, z: -inward * 0.41 * w } : { x: inward * 0.41 * w, z: 0 };
    return new Vector3(x + nx * 0.2 + side.x, y + 0.37 * h, z + nz * 0.2 + side.z);
  }

  function sign(seg, x, z, y, text, width = 2.2) {
    const m = new Mesh(new PlaneGeometry(width, width / 4), new MeshBasicMaterial({ map: signTexture(text) }));
    m.position.set(x - 0.12, y, z);
    m.rotation.y = -Math.PI / 2;
    put(seg, m, false);
  }

  function chandelier(seg, x, z, y, radius, bulbs) {
    const tone = TONES[seg.tone];
    put(seg, box(0.07, 0.8, 0.07, x, y + 0.4, z, solid(tone.frame)), false);
    const ring = new Mesh(new TorusGeometry(radius, 0.045, 6, 28), solid(tone.frame));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y, z);
    put(seg, ring, false);
    for (let k = 0; k < bulbs; k++) {
      const a = (k / bulbs) * Math.PI * 2;
      put(seg, box(0.15, 0.24, 0.15, x + Math.cos(a) * radius, y + 0.14, z + Math.sin(a) * radius, solid('#FFE9C4')), false);
    }
  }

  function plant(seg, x, z) {
    put(seg, box(0.5, 0.42, 0.5, x, FLOOR + 0.21, z, solid(TONES[seg.tone].frame)));
    const cutout = new Mesh(new PlaneGeometry(1.5, 1.9), leaf);
    cutout.position.set(x, FLOOR + 1.35, z);
    put(seg, cutout, false);
  }

  // The lobby: the entrance wall with its big doorway, the logo on the blank far wall, the way to room 02.
  const lobby = segment('paper', (LOBBY.x0 + LOBBY.x1) / 2, AXIS, 16);
  shell(lobby, {
    x0: LOBBY.x0, x1: LOBBY.x1, z: AXIS, half: LOBBY.half, height: LOBBY.height,
    door: { z: AXIS, half: 4.5, height: 2.55 },
    arch: { z: LAYOUT.lobby.arch.z, half: ARCH.half, height: ARCH.height },
  });
  const logo = new Mesh(new PlaneGeometry(6, 1.5), new MeshBasicMaterial({ map: logoTexture() }));
  logo.position.set(LOBBY.x1 - 0.12, FLOOR + 3.2, AXIS + 1.8);
  logo.rotation.y = -Math.PI / 2;
  put(lobby, logo, false);
  put(lobby, box(4, 1.05, 1.1, 34, FLOOR + 0.525, AXIS + 5.2, solid('#F4F0E7')));
  chandelier(lobby, 31, AXIS, FLOOR + LOBBY.height - 0.9, 1.5, 10);
  plant(lobby, 26.5, AXIS - 5.6);
  plant(lobby, 37.5, AXIS + 5.6);
  sign(lobby, LOBBY.x1, LAYOUT.lobby.arch.z, FLOOR + ARCH.height + 0.45, 'TO ROOM 02');
  anchors.lobby = (EGGS.lobby || []).map((egg, k) => ({
    egg,
    pos: hang(lobby, {
      x: 27.5 + k * 7, z: AXIS - LOBBY.half + 0.1, y: FLOOR + 2.1, w: 2.8, h: 1.96,
      inward: 1, texture: eggSignTexture(egg, 'paper'),
    }),
  }));

  ROOMS.forEach((room, i) => {
    const at = LAYOUT.rooms[i];
    const next = ROOMS[i + 1];
    const tone = room.tone === 'night' ? 'night' : 'paper';

    const hall = segment('hall', (at.path[0].x + at.rx0) / 2, (at.path[0].z + at.z) / 2, 12);
    hallway(hall, at.path, at.side);
    const strip = STRIPS[room.id] || [];
    strip.forEach((panel, k) => {
      const t = strip.length > 1 ? 0.12 + (k * 0.74) / (strip.length - 1) : 0.5;
      const spot = pointOn(at.path, t);
      const back = pointOn(at.path, Math.max(0, t - 0.04));
      const fwd = pointOn(at.path, Math.min(1, t + 0.04));
      const alongX = Math.abs(fwd.x - back.x) >= Math.abs(fwd.z - back.z);
      // Through a turn only the outer wall runs the whole way, so both panels hang there.
      const face = alongX ? (k % 2 ? 1 : -1) : 1;
      hang(hall, {
        x: alongX ? spot.x : spot.x + face * (HALL.half - 0.1),
        z: alongX ? spot.z + face * (HALL.half - 0.1) : spot.z,
        y: FLOOR + 1.75, w: 1.5, h: 1.17, axis: alongX ? 'z' : 'x', inward: -face,
        texture: comicTexture(panel, k),
      });
    });

    const seg = segment(tone, (at.rx0 + at.rx1) / 2, at.z, 14);
    shell(seg, {
      x0: at.rx0, x1: at.rx1, z: at.z, half: ROOM.half, height: ROOM.height, entry: TONES.hall.wall,
      door: { z: at.z, half: DOOR.half, height: DOOR.height },
      arch: next ? { z: at.arch.z, half: ARCH.half, height: ARCH.height } : null,
    });
    hang(seg, { x: at.rx0 + 1.7, z: at.z - ROOM.half + 0.1, y: FLOOR + 2.3, w: 2.2, h: 1.1, inward: 1, wash: false, texture: plateTexture(room) });
    chandelier(seg, at.rx0 + 8, at.z, FLOOR + ROOM.height - 0.85, 1.3, 8);
    plant(seg, at.rx0 + 1.7, at.z + ROOM.half - 1.3);
    const light = tone === 'paper';
    put(seg, box(8.5, 0.02, 5.2, at.rx0 + 8, FLOOR + 0.011, at.z, solid(light ? '#D9D2C1' : '#23211D')));
    [-1, 1].forEach((side) => {
      put(seg, box(2.8, 0.42, 0.72, at.rx0 + 8.5, FLOOR + 0.21, at.z + side * 3.6, solid(light ? '#F4F0E7' : '#2C2A26')));
      put(seg, box(ROOM.length - 0.4, 0.05, 0.04, at.rx0 + 8, FLOOR + 1.05, at.z + side * (ROOM.half - 0.12), solid(TONES[tone].frame)), false);
    });
    if (next) sign(seg, at.rx1, at.arch.z, FLOOR + ARCH.height + 0.45, `TO ROOM ${next.no}`);
    sign(seg, at.rx0, at.z, FLOOR + DOOR.height + 0.25, `ROOM ${room.no}`, 1.8);

    anchors[room.id] = (EGGS[room.id] || []).slice(0, SLOTS.length).map((egg, k) => {
      const [side, dx] = SLOTS[k];
      const texture = egg.art ? pictureTexture(egg.art, tone, { egg: true }) : eggSignTexture(egg, tone);
      return { egg, pos: hang(seg, { x: at.rx0 + dx, z: at.z + side * (ROOM.half - 0.1), y: FLOOR + 2.2, w: 3, h: 2.1, inward: -side, texture }) };
    });
    const eggArts = new Set((EGGS[room.id] || []).map((e) => e.art).filter(Boolean));
    const arts = [...new Set([...(room.beats || []), ...(room.exhibits || [])].map((b) => b.art))].filter((a) => a && !eggArts.has(a));
    SLOTS.slice(anchors[room.id].length).forEach(([side, dx], k) => {
      if (arts[k]) hang(seg, { x: at.rx0 + dx, z: at.z + side * (ROOM.half - 0.1), y: FLOOR + 2.2, w: 3, h: 2.1, inward: -side, texture: pictureTexture(arts[k], tone) });
    });

    // Warm light spilling out of the doorway, so the corridor ends on a lit door rather than a black wall.
    const halo = new Mesh(new PlaneGeometry(4.4, 3.6), lampLight);
    halo.rotation.y = -Math.PI / 2;
    halo.position.set(at.rx0 - 0.07, FLOOR + 1.5, at.z);
    hall.group.add(halo);
    const spill = new Mesh(new PlaneGeometry(5.5, 5.5), lampLight);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(at.rx0 - 1.8, FLOOR + 0.02, at.z);
    hall.group.add(spill);

    const face = [doorFace, doorFace, solid('#0E0D0B'), solid('#0E0D0B'), solid('#0E0D0B'), solid('#0E0D0B')];
    doors.push([[at.z - DOOR.half, 1], [at.z + DOOR.half, -1]].map(([z, dir]) => {
      const pivot = new Group();
      pivot.position.set(at.rx0, FLOOR, z);
      const door = box(0.08, DOOR.height, DOOR.half, 0, DOOR.height / 2, (dir * DOOR.half) / 2, face);
      door.add(lines(edgesOf([box(0.08, DOOR.height, DOOR.half, 0, 0, 0, face)]), ink('night')));
      pivot.add(door);
      seg.group.add(pivot);
      return { pivot, dir };
    }));
  });

  segments.forEach((seg) => { seg.ink = lines(edgesOf(seg.inked), ink(seg.tone)); seg.group.add(seg.ink); });

  return {
    group,
    materials,
    anchors,
    // Open room i's door (0 shut, 1 wide open).
    setDoor(i, t) { (doors[i] || []).forEach(({ pivot, dir }) => { pivot.rotation.y = dir * 1.65 * t; }); },
    // Keep what is near you, drop what is far, and paint drawings well before they come into view.
    update(at) {
      segments.forEach((seg) => {
        const away = at.distanceTo(seg.center) - seg.reach;
        seg.group.visible = away < 46;
        // From far off a room's ink lines collapse into noise, so they wait until you are closer.
        seg.ink.visible = away < 22;
        if (away < 95 && seg.textures.length) seg.textures.splice(0).forEach((t) => t.userData.load());
      });
    },
  };
}

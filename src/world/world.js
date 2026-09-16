// Fifth Avenue at night, in three.js. Central Park on the west side, lit buildings on the east,
// billboards that greet the visitor by number, cabs heading downtown, and the spiral museum
// with its ticket booth at 88th Street. Ink lines "boil" between three hand-jittered versions.

import {
  AdditiveBlending, BoxGeometry, BufferGeometry, CylinderGeometry, EdgesGeometry, Float32BufferAttribute, Fog, Group,
  Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Points, PointsMaterial, RingGeometry, Scene, SphereGeometry, Sprite,
  SpriteMaterial, Vector3, WebGLRenderer,
} from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as T from './textures.js';
import { ANCHORS, SHOTS } from './shots.js';
import { createRail } from './rail.js';
import { buildMuseum } from './interior.js';
import { formatVisitor } from '../lib/state.js';

const STREETS = [
  { z: 80, name: 'E 85 ST' }, { z: 0, name: 'E 86 ST' }, { z: -80, name: 'E 87 ST' },
  { z: -160, name: 'E 88 ST' }, { z: -240, name: 'E 89 ST' }, { z: -320, name: 'E 90 ST' },
];
const LANES = [-6.75, -2.25, 2.25, 6.75];

export function createWorld(canvas) {
  const small = matchMedia('(max-width: 719px), (pointer: coarse)').matches;
  const rnd = T.seeded(11);
  const renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, stencil: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  scene.fog = new Fog(T.NIGHT, 140, 900);
  const camera = new PerspectiveCamera(45, 1, 0.1, 1800);
  // Everything outside the museum lives in the city group, so it can be hidden once you are inside.
  const city = new Group();
  scene.add(city);

  const mat = {
    dark: new MeshBasicMaterial({ color: T.DARK }),
    road: new MeshBasicMaterial({ color: '#0C0B0A' }),
    walk: new MeshBasicMaterial({ color: '#191814' }),
    paper: new MeshBasicMaterial({ color: T.PAPER }),
    lamp: new MeshBasicMaterial({ color: '#FFD49C' }),
    taxi: new MeshBasicMaterial({ color: '#FFC21A' }),
    paint: new MeshBasicMaterial({ color: T.PAPER, transparent: true, opacity: 0.5 }),
    hatch: new MeshBasicMaterial({ map: T.hatchTexture() }),
    pool: new MeshBasicMaterial({ map: T.poolTexture(), color: '#FFC98A', transparent: true, opacity: 0.46, blending: AdditiveBlending, depthWrite: false }),
  };
  const inked = [];
  const put = (mesh, ink = true) => { city.add(mesh); if (ink) inked.push(mesh); return mesh; };
  const box = (w, h, d, x, y, z, material) => { const m = new Mesh(new BoxGeometry(w, h, d), material); m.position.set(x, y, z); return m; };
  const flat = (w, d, x, z, y, material) => { const m = new Mesh(new PlaneGeometry(w, d), material); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); city.add(m); return m; };
  const face = (map) => new MeshBasicMaterial({ map });

  // Ground: the avenue, sidewalks, the park, and the museum plaza.
  flat(900, 1200, 40, -150, 0, mat.dark);
  flat(18, 1200, 0, -150, 0.01, mat.road);
  flat(5, 1200, 11.5, -150, 0.02, mat.walk);
  flat(5, 1200, -11.5, -150, 0.02, mat.walk);
  flat(8, 68, 18, -200, 0.02, mat.walk);
  const grass = T.hatchTexture().clone();
  grass.repeat.set(30, 90);
  grass.needsUpdate = true;
  flat(140, 1200, -84, -150, 0.015, face(grass));
  STREETS.forEach((s) => flat(90, 12, 54, s.z, 0.01, mat.road));
  [-9, 9].forEach((x) => put(box(0.26, 0.16, 1200, x, 0.08, -150, mat.dark)));

  // Paint: lane dashes, crosswalks and stop lines, merged into one mesh.
  const marks = [];
  const mark = (w, d, x, z) => { const g = new PlaneGeometry(w, d); g.rotateX(-Math.PI / 2); g.translate(x, 0.03, z); marks.push(g); };
  for (let z = 240; z > -560; z -= 12) [-4.5, 0, 4.5].forEach((x) => mark(0.16, 5, x, z));
  STREETS.forEach((s) => {
    for (let x = -8.4; x <= 8.41; x += 1.2) mark(0.62, 3.6, x, s.z + 7.8);
    mark(18, 0.35, 0, s.z + 10.4);
  });
  city.add(new Mesh(mergeGeometries(marks), mat.paint));

  // East side: blocks of lit apartment buildings with water towers.
  const blocks = [[230, 86], [74, 6], [-6, -74], [-86, -154], [-246, -314], [-326, -560]];
  blocks.forEach(([z0, z1]) => {
    for (let z = z0; z - z1 > 8;) {
      const w = Math.min(z - z1, 14 + rnd() * 18);
      const lowRise = z < 62 && z > 8;
      const nearMuseum = z < -80 && z > -330;
      const h = lowRise ? 26 + rnd() * 4 : nearMuseum ? 18 + rnd() * 16 : 24 + rnd() * 32;
      const d = 16 + rnd() * 16;
      const floors = Math.max(4, Math.round(h / 3.4));
      const seed = Math.floor(rnd() * 1000);
      const avenue = face(T.facadeTexture({ floors, bays: Math.max(3, Math.round(w / 3.2)), seed }));
      const south = face(T.facadeTexture({ floors, bays: Math.max(3, Math.round(d / 3.2)), seed: seed + 1 }));
      put(box(d, h, w, 14 + d / 2, h / 2, z - w / 2, [mat.hatch, avenue, mat.dark, mat.dark, south, mat.hatch]));
      if (rnd() > 0.55) {
        const tx = 14 + d * (0.35 + rnd() * 0.3);
        const tz = z - w * (0.3 + rnd() * 0.4);
        const tank = new Mesh(new CylinderGeometry(1.5, 1.5, 3, 12), mat.dark);
        tank.position.set(tx, h + 3.5, tz);
        tank.userData.edgeAngle = 40;
        put(tank);
        const roof = new Mesh(new CylinderGeometry(0.1, 1.7, 1.2, 12), mat.dark);
        roof.position.set(tx, h + 5.6, tz);
        roof.userData.edgeAngle = 40;
        put(roof);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => put(box(0.12, 2, 0.12, tx + a, h + 1, tz + b, mat.dark)));
      }
      z -= w + 0.6;
    }
  });

  // Behind Fifth Avenue: Madison and Park Avenue towers, merged into one mesh so they cost one draw call.
  const towerParts = [];
  const beacon = new SpriteMaterial({ map: T.poolTexture(), color: '#FF5040', transparent: true, blending: AdditiveBlending, depthWrite: false });
  for (let row = 0; row < (small ? 2 : 3); row++) {
    for (let z = 250; z > -640;) {
      const w = 16 + rnd() * 24;
      const d = 18 + rnd() * 24;
      if (row === 0 && z < -130 && z > -270) { z -= w; continue; }
      const h = row === 0 ? 28 + rnd() * 46 : 36 + rnd() * (row === 1 ? 80 : 150);
      const g = new BoxGeometry(d, h, w);
      const uv = g.attributes.uv;
      const normal = g.attributes.normal;
      for (let i = 0; i < uv.count; i++) {
        if (Math.abs(normal.getY(i)) > 0.5) { uv.setXY(i, 0.01, 0.99); continue; }
        const across = Math.abs(normal.getX(i)) > 0.5 ? w : d;
        uv.setXY(i, (uv.getX(i) * across) / 24, (uv.getY(i) * h) / 28);
      }
      const x = 58 + row * 64 + rnd() * 14;
      g.translate(x + d / 2, h / 2, z - w / 2);
      towerParts.push(g);
      if (h > 110) {
        const light = new Sprite(beacon);
        light.scale.set(6, 6, 1);
        light.position.set(x + d / 2, h + 1.5, z - w / 2);
        city.add(light);
      }
      z -= w + 5 + rnd() * 10;
    }
  }
  put(new Mesh(mergeGeometries(towerParts), face(T.towerTexture())));

  // West side: the Central Park wall and its trees.
  put(box(0.7, 1.1, 1200, -14.7, 0.55, -150, mat.dark));
  const treeTextures = [1, 2, 3].map((s) => T.treeTexture(s * 17));
  for (let i = 0; i < (small ? 34 : 70); i++) {
    const h = 8 + rnd() * 7;
    const tree = new Sprite(new SpriteMaterial({ map: treeTextures[i % 3], transparent: true, alphaTest: 0.2 }));
    tree.scale.set(h, h, 1);
    tree.position.set(-17.5 - rnd() * 56, h / 2 - 0.4, 230 - rnd() * 700);
    city.add(tree);
  }

  // Central Park after dark: kids playing football on a lit lawn.
  const PX = -98;
  const PZ = -104;
  const PW = 22;
  const PL = 34;
  const pitchLines = [];
  const strip = (w, d, x, z) => { const g = new PlaneGeometry(w, d); g.rotateX(-Math.PI / 2); g.translate(x, 0.045, z); pitchLines.push(g); };
  strip(PW, 0.25, PX, PZ - PL / 2);
  strip(PW, 0.25, PX, PZ + PL / 2);
  strip(0.25, PL, PX - PW / 2, PZ);
  strip(0.25, PL, PX + PW / 2, PZ);
  strip(PW, 0.25, PX, PZ);
  const centre = new RingGeometry(3.2, 3.45, 40);
  centre.rotateX(-Math.PI / 2);
  centre.translate(PX, 0.045, PZ);
  pitchLines.push(centre);
  city.add(new Mesh(mergeGeometries(pitchLines), mat.paint));
  [-1, 1].forEach((end) => {
    const gz = PZ + end * (PL / 2 - 0.2);
    put(box(0.12, 2.1, 0.12, PX - 3, 1.05, gz, mat.dark));
    put(box(0.12, 2.1, 0.12, PX + 3, 1.05, gz, mat.dark));
    put(box(6.12, 0.12, 0.12, PX, 2.1, gz, mat.dark));
    flat(24, 24, PX, PZ + end * (PL / 4), 0.035, mat.pool);
  });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
    const lx = PX + a * (PW / 2 + 2);
    const lz = PZ + b * (PL / 2 + 2);
    put(box(0.25, 10, 0.25, lx, 5, lz, mat.dark));
    city.add(box(1.2, 0.5, 0.6, lx, 10.1, lz, mat.lamp));
  });
  const kidSheet = T.kidSheet();
  const kids = [[-0.35, -0.3], [0.3, -0.25], [0, -0.42], [-0.2, 0.1], [0.25, 0.28], [-0.3, 0.35], [0, 0.44], [0.1, -0.05]].map(([fx, fz], i) => {
    const map = kidSheet.texture.clone();
    map.repeat.set(1 / kidSheet.variants, 0.5);
    map.offset.set((i % kidSheet.variants) / kidSheet.variants, 0.5);
    map.needsUpdate = true;
    const sprite = new Sprite(new SpriteMaterial({ map, transparent: true, alphaTest: 0.2 }));
    sprite.scale.set(1.7, 2.55, 1);
    const home = new Vector3(PX + fx * PW, 1.28, PZ + fz * PL);
    sprite.position.copy(home);
    city.add(sprite);
    return { sprite, map, home, frame: 0, speed: 3 + rnd() * 1.6 };
  });
  const ball = new Mesh(new SphereGeometry(0.34, 12, 8), mat.paper);
  ball.position.set(PX, 0.34, PZ);
  city.add(ball);
  const play = { from: new Vector3(PX, 0.34, PZ), to: new Vector3(PX, 0.34, PZ), t: 1, duration: 1, holder: 0 };

  // Lampposts along both curbs, with halftone light on the pavement and banners on the east side.
  const banners = ['NOW OPEN', '12 ROOMS', 'VISITORS', 'TONIGHT'].map((t) => new MeshBasicMaterial({ map: T.bannerTexture(t), transparent: true }));
  let lamp = 0;
  for (let z = 190; z > -470; z -= 30) {
    [[9.7, -1], [-9.7, 1]].forEach(([x, dir]) => {
      // Keep the museum's entrance clear: no post in front of the steps, where the guide meets you.
      if (x > 0 && z === -200) return;
      put(box(0.18, 7.2, 0.18, x, 3.6, z, mat.dark));
      put(box(1.7, 0.14, 0.14, x + dir * 0.85, 7.1, z, mat.dark));
      city.add(box(0.7, 0.24, 0.5, x + dir * 1.65, 6.95, z, mat.lamp));
      flat(8, 8, x + dir * 1.65, z, 0.05, mat.pool);
      if (dir < 0 && lamp % 2 === 0) {
        const banner = new Mesh(new PlaneGeometry(0.62, 2.4), banners[(lamp / 2) % banners.length]);
        banner.position.set(x - 0.42, 4.7, z);
        city.add(banner);
      }
    });
    lamp += 1;
  }

  // Street signs at every corner.
  STREETS.forEach((s) => {
    put(box(0.1, 3.5, 0.1, 9.9, 1.75, s.z + 6.4, mat.dark));
    const plate = new Mesh(new PlaneGeometry(1.7, 0.42), face(T.plateTexture(s.name)));
    plate.position.set(9.9, 3.35, s.z + 6.47);
    city.add(plate);
  });

  // Billboards. The first spans the avenue and greets the visitor by number.
  const visitorBoard = T.dotBillboard();
  put(box(0.6, 18, 0.6, -10.6, 9, -40, mat.dark));
  put(box(0.6, 18, 0.6, 10.6, 9, -40, mat.dark));
  put(box(22, 0.5, 0.6, 0, 18.2, -40, mat.dark));
  put(box(18.4, 9.4, 0.3, 0, 13.2, -40.25, mat.dark));
  const gantry = new Mesh(new PlaneGeometry(18, 9), face(visitorBoard.texture));
  gantry.position.set(0, 13.2, -40.05);
  city.add(gantry);

  const welcomeBoard = T.dotBillboard();
  welcomeBoard.draw([{ text: 'WELCOME TO THE', size: 12, y: 0.3 }, { text: 'MUSEUM OF MANOJ', size: 15, y: 0.67 }]);
  const roofBoard = new Group();
  roofBoard.position.set(27, 36, 38);
  roofBoard.rotation.y = -0.35;
  city.add(roofBoard);
  const roofPanel = new Mesh(new PlaneGeometry(20, 10), face(welcomeBoard.texture));
  const roofBacking = box(20.4, 10.4, 0.3, 0, 0, -0.2, mat.dark);
  roofBoard.add(roofPanel, roofBacking, box(0.4, 10, 0.4, -6, -8, -0.2, mat.dark), box(0.4, 10, 0.4, 6, -8, -0.2, mat.dark));
  roofBoard.updateMatrixWorld(true);
  inked.push(roofBacking);

  const bladeBoard = T.dotBillboard({ w: 512, h: 768, cell: 9 });
  bladeBoard.draw([
    { text: 'NOW', size: 12, y: 0.16 }, { text: 'SHOWING', size: 11, y: 0.32 }, { text: 'CHENNAI', size: 11, y: 0.54 },
    { text: 'TO', size: 10, y: 0.69 }, { text: 'NEW YORK', size: 10, y: 0.84 },
  ]);
  put(box(6.2, 9.2, 0.3, 11, 15, -118.2, mat.dark));
  const blade = new Mesh(new PlaneGeometry(6, 9), face(bladeBoard.texture));
  blade.position.set(11, 15, -118.02);
  city.add(blade);

  // A bus shelter on the park side with a poster.
  put(box(1.8, 0.12, 4.2, -11.9, 2.6, -60, mat.dark));
  put(box(0.08, 2.5, 4.2, -12.7, 1.3, -60, mat.dark));
  const poster = new Mesh(new PlaneGeometry(1.1, 2.2), banners[1]);
  poster.position.set(-12.2, 1.4, -57.86);
  city.add(poster);

  // The museum: four widening bands above the entrance, and the annex tower behind.
  for (let i = 0; i < 4; i++) {
    const rb = 11.5 + i * 1.7;
    const hgt = i === 3 ? 6.4 : 5.2;
    const y = 3.6 + i * 5.7 + hgt / 2;
    const map = i === 3 ? T.bandTexture({ sign: 'Museum of Manoj', seed: 5 }) : T.bandTexture({ seed: 10 + i });
    const band = new Mesh(new CylinderGeometry(rb + 1.2, rb, hgt, 72), [face(map), mat.dark, mat.dark]);
    band.position.set(40, y, -200);
    band.userData.edgeAngle = 30;
    put(band);
    const ring = new Mesh(new CylinderGeometry(rb - 0.7, rb - 0.7, 0.5, 48), mat.dark);
    ring.position.set(40, y - hgt / 2 - 0.25, -200);
    city.add(ring);
  }
  const tower = box(18, 38, 18, 64, 19, -220, [mat.hatch, face(T.facadeTexture({ floors: 11, bays: 5, seed: 3 })), mat.dark, mat.dark, face(T.facadeTexture({ floors: 11, bays: 5, seed: 4 })), mat.hatch]);
  put(tower);

  // The ticket booth on the plaza, with a TICKETS sign whose bulbs chase.
  const [signA, signB] = T.boothSignTextures();
  const signFace = face(signA);
  put(box(2.2, 3.0, 2.4, 18.5, 1.5, -178, [mat.dark, face(T.boothFrontTexture()), mat.dark, mat.dark, mat.dark, mat.dark]));
  // Beside the window, the guides' door: Manoj comes out here to walk you to the steps (guide.js).
  const guideDoor = T.boothDoorTextures();
  put(box(2.2, 3.0, 1.3, 18.5, 1.5, -179.85, [mat.dark, face(guideDoor.wall), mat.dark, mat.dark, mat.dark, mat.dark]));
  put(box(2.9, 0.14, 4.3, 18.4, 3.07, -178.65, mat.dark));
  put(box(0.3, 0.9, 3.2, 17.9, 3.6, -178, [mat.dark, signFace, mat.dark, mat.dark, mat.dark, mat.dark]));
  flat(6, 6, 16.4, -178, 0.06, mat.pool);
  const doorInk = new LineMaterial({ color: T.PAPER, linewidth: small ? 1.2 : 1.5, worldUnits: false, transparent: true, opacity: 0.9, fog: true });
  const sideDoor = new Group();
  sideDoor.position.set(17.36, 0, -180.3);
  const doorLeaf = box(0.05, 2.15, 0.9, 0, 1.075, 0.45, [mat.dark, face(guideDoor.leaf), mat.dark, mat.dark, mat.dark, mat.dark]);
  const leafEdges = new EdgesGeometry(doorLeaf.geometry);
  const leafLines = new LineSegmentsGeometry();
  leafLines.setPositions(leafEdges.attributes.position.array);
  leafEdges.dispose();
  doorLeaf.add(new LineSegments2(leafLines, doorInk));
  sideDoor.add(doorLeaf);
  city.add(sideDoor);
  const doorSpill = new MeshBasicMaterial({ map: T.poolTexture(), color: '#FFC98A', transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  flat(2.4, 3, 16.3, -179.85, 0.065, doorSpill);

  // The uptown skyline, and stars.
  const skyline = new MeshBasicMaterial({ map: T.skylineTexture(), transparent: true, fog: false, depthWrite: false });
  const north = new Mesh(new PlaneGeometry(3400, 300), skyline);
  north.position.set(700, 110, -1200);
  const east = new Mesh(new PlaneGeometry(2600, 300), skyline);
  east.position.set(1300, 110, -300);
  east.rotation.y = -Math.PI / 2;
  city.add(east);
  city.add(north);
  const west = new Mesh(new PlaneGeometry(2000, 300), skyline);
  west.position.set(-900, 110, -300);
  west.rotation.y = Math.PI / 2;
  city.add(west);
  const stars = [];
  for (let i = 0; i < (small ? 240 : 460); i++) {
    const theta = rnd() * Math.PI * 2;
    const phi = 0.12 + rnd() * 0.75;
    stars.push(Math.cos(theta) * Math.cos(phi) * 1400, 160 + Math.sin(phi) * 800, Math.sin(theta) * Math.cos(phi) * 1400 - 300);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute('position', new Float32BufferAttribute(stars, 3));
  city.add(new Points(starGeometry, new PointsMaterial({ color: T.PAPER, size: small ? 2 : 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.7 })));

  // Ink: every edge of the static city, drawn as fat lines in three jittered versions.
  const ink = new LineMaterial({ color: T.PAPER, linewidth: small ? 1.3 : 1.6, worldUnits: false, transparent: true, opacity: 0.9, fog: true });
  const segments = [];
  const v = new Vector3();
  inked.forEach((mesh) => {
    mesh.updateMatrixWorld(true);
    const edges = new EdgesGeometry(mesh.geometry, mesh.userData.edgeAngle || 20);
    const pos = edges.attributes.position;
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld); segments.push(v.x, v.y, v.z); }
    edges.dispose();
  });
  const boil = new Group();
  const jitter = T.seeded(77);
  for (let k = 0; k < 3; k++) {
    const arr = new Float32Array(segments.length);
    for (let i = 0; i < segments.length; i++) arr[i] = segments[i] + (jitter() - 0.5) * 0.1;
    const geo = new LineSegmentsGeometry();
    geo.setPositions(arr);
    const lines = new LineSegments2(geo, ink);
    lines.visible = k === 0;
    boil.add(lines);
  }
  city.add(boil);

  // The museum's entrance, and the rooms behind it where the walk continues inside.
  const museum = buildMuseum({ city });

  // Cabs, all heading downtown (Fifth Avenue runs one way, south).
  const carInk = new LineMaterial({ color: T.PAPER, linewidth: small ? 1.2 : 1.5, worldUnits: false, transparent: true, opacity: 0.85, fog: true });
  const glow = new SpriteMaterial({ map: T.poolTexture(), color: '#FFE6BA', transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.9 });
  const cars = [];
  for (let i = 0; i < (small ? 5 : 9); i++) {
    const car = new Group();
    const body = box(1.9, 1.1, 4.6, 0, 0.75, 0, mat.dark);
    const cabin = box(1.7, 0.8, 2.3, 0, 1.7, 0.15, mat.dark);
    car.add(body, cabin, box(0.5, 0.2, 0.3, 0, 2.2, 0.15, mat.taxi));
    const carSegs = [];
    [body, cabin].forEach((part) => {
      const edges = new EdgesGeometry(part.geometry);
      const pos = edges.attributes.position;
      for (let j = 0; j < pos.count; j++) { v.fromBufferAttribute(pos, j).add(part.position); carSegs.push(v.x, v.y, v.z); }
    });
    const carGeo = new LineSegmentsGeometry();
    carGeo.setPositions(carSegs);
    car.add(new LineSegments2(carGeo, carInk));
    [-0.62, 0.62].forEach((x) => { const light = new Sprite(glow); light.scale.set(1.5, 1.5, 1); light.position.set(x, 0.75, 2.4); car.add(light); });
    car.position.set(LANES[i % LANES.length], 0, 220 - rnd() * 780);
    car.userData.speed = 9 + rnd() * 6;
    city.add(car);
    cars.push(car);
  }

  // People on both sidewalks, two walking frames each.
  const sheet = T.walkerSheet();
  const walkers = [];
  for (let i = 0; i < (small ? 26 : 48); i++) {
    const map = sheet.texture.clone();
    map.repeat.set(1 / sheet.variants, 1 / sheet.frames);
    map.offset.set((i % sheet.variants) / sheet.variants, 0.5);
    map.needsUpdate = true;
    const sprite = new Sprite(new SpriteMaterial({ map, transparent: true, alphaTest: 0.2 }));
    sprite.scale.set(0.9, 1.8, 1);
    const east = rnd() > 0.5;
    sprite.position.set(east ? 9.8 + rnd() * 2.6 : -(9.8 + rnd() * 3.6), 0.9, 220 - rnd() * 760);
    city.add(sprite);
    walkers.push({ sprite, map, speed: (rnd() > 0.5 ? 1 : -1) * (1.1 + rnd() * 0.6), phase: rnd(), frame: 0 });
  }

  // The visitor billboard counts up to this browser's number.
  let counting = 0;
  function showVisitor(n) {
    clearInterval(counting);
    if (!Number.isInteger(n)) {
      visitorBoard.draw([{ text: 'WELCOME, VISITOR', size: 13, y: 0.33 }, { text: 'TO THE MUSEUM OF MANOJ', size: 11, y: 0.68 }]);
      return;
    }
    const start = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - start) / 1400);
      const shown = Math.max(1, Math.round(n * (1 - (1 - k) ** 3)));
      visitorBoard.draw([{ text: "YOU'RE VISITOR", size: 12, y: 0.3 }, { text: formatVisitor(shown), size: 27, y: 0.68 }]);
      if (k >= 1) clearInterval(counting);
    };
    tick();
    counting = setInterval(tick, 70);
  }

  // Frame loop pieces.
  const pos = new Vector3();
  const look = new Vector3();
  const tmp = new Vector3();
  let railY = window.scrollY;
  let override = null;
  let progress = 0;
  const listeners = new Set();
  let width = 1;
  let height = 1;
  let boilIndex = 0;
  let boilClock = 0;
  let signClock = 0;
  let signPhase = 0;

  function resize(w, h) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.fov = aspect < 0.8 ? 64 : aspect < 1.25 ? 52 : 44;
    camera.updateProjectionMatrix();
    ink.resolution.set(width, height);
    carInk.resolution.set(width, height);
    museum.materials.forEach((m) => m.resolution.set(width, height));
    doorInk.resolution.set(width, height);
  }

  function frame(time, dt, { settle = false } = {}) {
    const y = window.scrollY;
    if (settle || Math.abs(y - railY) > window.innerHeight * 4) railY = y;
    else railY += (y - railY) * (1 - Math.exp(-dt * 5));
    // Past the entrance the page is plain sections and the canvas is completely covered. Drawing a city nobody
    // can see costs a frame's work on every scroll of the rest of the page, so stop until you come back up.
    const climb = rail.span('steps');
    if (!settle && climb && railY > climb[1] + window.innerHeight + 40) return;
    rail.pose(railY, pos, look);
    if (override) { pos.fromArray(override.pos); look.fromArray(override.look); }
    progress = rail.local('plaza', railY);
    // The doors swing open as you reach the landing, and the light behind them takes the screen.
    const entering = rail.local('steps', railY);
    museum.setDoors(Math.min(1, Math.max(0, (entering - 0.74) / 0.16)));
    // The booth framing lets go as the guide leaves the window, and his door opens to let him out.
    const walked = rail.local('walk', railY);
    const booth = 1 - Math.min(1, Math.max(0, (walked - 0.04) / 0.2));
    const opened = Math.min(1, Math.max(0, (walked - 0.13) / 0.07));
    sideDoor.rotation.y = -1.75 * opened;
    doorSpill.opacity = 0.5 * opened;
    const aspect = width / height;
    const arrive = Math.min(1, Math.max(0, (progress - 0.62) / 0.24)) * booth;
    if (aspect > 1.2) look.z += 1.25 * arrive;
    if (aspect < 0.8) {
      // Phones: keep the city and the booth in the top half, above the text and the tour sheet.
      const early = 1 - Math.min(1, progress / 0.25);
      tmp.subVectors(pos, look).setY(0).normalize();
      pos.addScaledVector(tmp, 3.4 * arrive);
      look.y -= 2.9 * arrive + 18 * early;
    }
    // The camera breathes on the street, and settles as it reaches the doors.
    const sway = 1 - arrive * 0.85;
    pos.x += Math.sin(time * 0.5) * 0.06 * sway;
    pos.y += Math.sin(time * 0.8) * 0.05 * sway;
    camera.position.copy(pos);
    camera.lookAt(look);

    {
      boilClock += dt;
      if (boilClock > 0.125) {
        boilClock = 0;
        boil.children[boilIndex].visible = false;
        boilIndex = (boilIndex + 1) % boil.children.length;
        boil.children[boilIndex].visible = true;
      }
      beacon.opacity = Math.sin(time * 2.2) > 0.2 ? 1 : 0.12;
      signClock += dt;
      if (signClock > 0.34) {
        signClock = 0;
        signPhase ^= 1;
        signFace.map = signPhase ? signB : signA;
      }
      cars.forEach((car) => {
        car.position.z += car.userData.speed * dt;
        if (car.position.z > 240) car.position.z = -560;
        car.visible = car.position.distanceTo(camera.position) > 7;
      });
      walkers.forEach((w) => {
        const p = w.sprite.position;
        p.z += w.speed * dt;
        if (p.z > 240) p.z = -520;
        if (p.z < -540) p.z = 220;
        const f = Math.floor(time * 4 + w.phase * 2) % 2;
        if (f !== w.frame) { w.frame = f; w.map.offset.y = f ? 0 : 0.5; }
        // The pavement in front of the museum stays clear, so nobody crosses in front of Manoj while he brings
        // you over from the booth. The crowd is seeded, not random, so without this the same passer-by walks
        // through the same shot on every single load. They thin out at the edge of it rather than blinking away.
        const clear = p.x > 4 && p.x < 21 ? Math.min(1, Math.max(0, Math.min(p.z + 218, -166 - p.z) / 6)) : 0;
        w.sprite.material.opacity = 1 - clear;
        w.sprite.visible = clear < 0.9 && p.distanceTo(camera.position) > 3;
      });
      // The football game: the ball hops from kid to kid, and the nearest kids chase it.
      play.t += dt / play.duration;
      if (play.t >= 1) {
        play.from.copy(ball.position);
        let next = Math.floor(Math.random() * kids.length);
        if (next === play.holder) next = (next + 1) % kids.length;
        play.holder = next;
        play.to.set(kids[next].sprite.position.x, 0.34, kids[next].sprite.position.z);
        play.duration = 0.6 + play.from.distanceTo(play.to) / 14;
        play.t = 0;
      }
      ball.position.lerpVectors(play.from, play.to, Math.min(1, play.t));
      ball.position.y = 0.34 + Math.sin(Math.PI * Math.min(1, play.t)) * Math.min(3, play.from.distanceTo(play.to) * 0.12);
      kids.forEach((kid, i) => {
        const chase = i === play.holder || kid.sprite.position.distanceTo(ball.position) < 7;
        const gx = chase ? ball.position.x : kid.home.x;
        const gz = chase ? ball.position.z : kid.home.z;
        const dx = gx - kid.sprite.position.x;
        const dz = gz - kid.sprite.position.z;
        const dist = Math.hypot(dx, dz);
        const moving = dist > 0.6;
        if (moving) {
          const step = Math.min(dist, kid.speed * dt);
          kid.sprite.position.x = Math.min(PX + PW / 2, Math.max(PX - PW / 2, kid.sprite.position.x + (dx / dist) * step));
          kid.sprite.position.z = Math.min(PZ + PL / 2, Math.max(PZ - PL / 2, kid.sprite.position.z + (dz / dist) * step));
        }
        const f = moving ? Math.floor(time * 6 + i) % 2 : 0;
        if (f !== kid.frame) { kid.frame = f; kid.map.offset.y = f ? 0 : 0.5; }
      });
    }
    renderer.autoClear = true;
    renderer.render(scene, camera);
  }

  // Screen position of a point on the booth, for pinning HTML to it.
  function anchor(name) {
    tmp.copy(ANCHORS[name]).project(camera);
    return { x: ((tmp.x + 1) / 2) * width, y: ((1 - tmp.y) / 2) * height, visible: tmp.z < 1 };
  }

  // The rail starts on Fifth Avenue; scenes further in add their own keyframes.
  const rail = createRail();
  rail.add(({ top, vh }) => {
    const el = document.getElementById('plaza');
    if (!el) return [];
    const start = top(el);
    const span = Math.max(1, el.offsetHeight - vh);
    rail.range('plaza', start, start + span);
    return SHOTS.map((s) => ({ y: start + s.at * span, pos: s.pos, look: s.look }));
  });
  // From the booth to the foot of the steps: the camera tracks alongside the guide as he walks over,
  // about five meters away (his path is in guide.js), with a little room ahead of him.
  rail.add(({ top }) => {
    const plaza = rail.span('plaza');
    const steps = document.getElementById('steps');
    if (!plaza || !steps) return [];
    const a = plaza[1];
    const b = top(steps);
    rail.range('walk', a, b);
    const at = (w) => a + (b - a) * w;
    return [
      { y: at(0.08), pos: [12.4, 2.25, -178], look: [18, 2.3, -178.2] },
      { y: at(0.2), pos: [12.3, 2.15, -179.3], look: [17.6, 1.5, -180.0] },
      { y: at(0.42), pos: [10.9, 2.0, -183.9], look: [15.9, 1.3, -184.8] },
      { y: at(0.6), pos: [9.5, 1.9, -190.1], look: [14.5, 1.25, -191.0] },
      { y: at(0.78), pos: [8.2, 1.82, -196.3], look: [13.2, 1.2, -197.2] },
      { y: at(0.9), pos: [7.5, 1.79, -199.7], look: [12.6, 1.2, -200.5] },
    ];
  });
  // Up the steps holding the guide's hand, then through the doors he holds open.
  rail.add(({ top, vh }) => {
    const el = document.getElementById('steps');
    if (!el) return [];
    const s0 = top(el);
    const span = Math.max(1, el.offsetHeight - vh);
    rail.range('steps', s0, s0 + span);
    const at = (s) => s0 + span * s;
    return [
      { y: s0, pos: [7.4, 1.78, -200], look: [22, 1.15, -200] },
      { y: at(0.12), pos: [7.6, 1.78, -200], look: [22, 1.3, -200] },
      { y: at(0.62), pos: [14.8, 2.08, -200], look: [26, 2.2, -200] },
      { y: at(0.74), pos: [15.7, 2.2, -200], look: [26, 2.3, -200] },
      // Hold back on the landing while he says "After you", then walk in once he has stepped out of the way.
      { y: at(0.84), pos: [16.6, 2.22, -200], look: [28, 2.4, -200] },
      { y: at(0.88), pos: [17.6, 2.2, -200], look: [29, 2.45, -200] },
      { y: at(0.93), pos: [21.0, 2.15, -200], look: [31, 2.5, -200] },
      { y: at(0.97), pos: [20.4, 2.1, -200], look: [34, 2.2, -200] },
      // Through the doors and into the vestibule. From here the frame is nothing but paper, so the welcome
      // section can take the screen with no edge to see.
      { y: s0 + span, pos: [23.4, 2.05, -200], look: [34, 2, -200] },
      // Still drifting forward while the section slides up over it: nothing stops dead at the handover.
      { y: s0 + el.offsetHeight - vh * 0.05, pos: [27.4, 2, -200], look: [34, 1.98, -200] },
    ];
  });
  rail.measure();
  ScrollTrigger.addEventListener('refresh', () => rail.measure());

  const fit = () => resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
  fit();
  window.addEventListener('resize', fit);

  gsap.ticker.add((time, deltaMs) => {
    frame(time, Math.min(0.05, deltaMs / 1000 || 1 / 60));
    listeners.forEach((fn) => fn(time));
  });

  return {
    renderer, camera, rail,
    anchor, showVisitor,
    get progress() { return progress; },
    get railY() { return railY; },
    // Where a world point lands on screen, in CSS pixels, with its depth in front of the camera.
    project(v, out = {}) {
      camera.updateMatrixWorld();
      tmp.copy(v).applyMatrix4(camera.matrixWorldInverse);
      out.depth = -tmp.z;
      tmp.copy(v).project(camera);
      out.x = ((tmp.x + 1) / 2) * width;
      out.y = ((1 - tmp.y) / 2) * height;
      return out;
    },
    onFrame: (fn) => { listeners.add(fn); },
    offFrame: (fn) => { listeners.delete(fn); },
    // Snap the camera to the current scroll position (used when checking shots in a background tab).
    // Hold the camera at a pose instead of the rail (pass nothing to release it). Used when tuning shots.
    preview: (pose) => { override = pose || null; frame(performance.now() / 1000, 1 / 60, { settle: true }); },
    settle: () => { frame(performance.now() / 1000, 1 / 60, { settle: true }); listeners.forEach((fn) => fn(gsap.ticker.time)); },
    // Scroll to a point in a named stretch of the walk and settle the camera there (used when checking shots).
    jump(name, p) {
      const range = rail.span(name);
      if (!range) return 0;
      window.scrollTo(0, range[0] + p * (range[1] - range[0]));
      frame(performance.now() / 1000, 1 / 60, { settle: true });
      listeners.forEach((fn) => fn(gsap.ticker.time));
      return progress;
    },
  };
}

// The museum's entrance on 26th Avenue: the plinth split around a doorway, the three steps, the landing,
// and the two front doors that swing open at the top of the climb.
// Behind them there are no rooms, only a shallow vestibule of paper-white light that the walk ends inside,
// which is what lets the welcome section take the screen without a seam.

import {
  BackSide, BoxGeometry, CanvasTexture, EdgesGeometry, Group, Mesh, MeshBasicMaterial, SRGBColorSpace, Vector3,
} from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

const INK = '#0E0D0B';
const PAPER = '#F1EDE3';
const FLOOR = 0.45;
const DOOR_TOP = 3.0;
const DOORWAY_X = 22.02; // the plane of the doorway, facing 26th Avenue

function box(w, h, d, x, y, z, material) {
  const m = new Mesh(new BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  return m;
}

function segmentsOf(meshes) {
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

function lines(segments, material) {
  const geo = new LineSegmentsGeometry();
  geo.setPositions(segments);
  return new LineSegments2(geo, material);
}

// The entrance doors: dark frames with warm glass.
function doorTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 256, 512);
  ctx.fillStyle = 'rgba(255, 214, 160, .92)';
  ctx.fillRect(38, 40, 180, 300);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 6;
  ctx.strokeRect(38, 40, 180, 300);
  ctx.beginPath();
  ctx.moveTo(128, 40);
  ctx.lineTo(128, 340);
  ctx.stroke();
  ctx.strokeRect(38, 372, 180, 100);
  ctx.fillStyle = PAPER;
  ctx.fillRect(196, 250, 10, 60);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function buildMuseum({ city }) {
  const materials = [];
  const ink = (color, width, opacity) => {
    const m = new LineMaterial({ color, linewidth: width, worldUnits: false, transparent: true, opacity });
    materials.push(m);
    return m;
  };
  const dark = new MeshBasicMaterial({ color: INK });

  // The entrance: the plinth split around a doorway, three steps, and a landing.
  const entrance = new Group();
  const outside = [];
  const add = (mesh) => { entrance.add(mesh); outside.push(mesh); return mesh; };
  add(box(10, 3.2, 23.5, 27, 1.6, -216.25, dark));
  add(box(10, 3.2, 23.5, 27, 1.6, -183.75, dark));
  add(box(10, 0.2, 9, 27, DOOR_TOP + 0.1, -200, dark));
  [[13.1, 0.15], [14.3, 0.3], [15.5, FLOOR]].forEach(([x, h]) => add(box(1.2, h, 11, x, h / 2, -200, dark)));
  add(box(6.5, FLOOR, 11, 19.25, FLOOR / 2, -200, dark));
  entrance.add(lines(segmentsOf(outside), ink(PAPER, 1.6, 0.9)));

  // A shallow vestibule of light just inside the doorway, drawn inside-out: its front face is culled, so from
  // the street you look straight into it, and once the camera steps inside there is no edge left anywhere in
  // frame. Every pixel is then the same paper the welcome section is printed on, at any shape of screen, which
  // is what makes the handover invisible rather than merely well matched. It sits just inside the opening, so
  // the plinth and lintel hide its corners from outside.
  const light = new Mesh(
    new BoxGeometry(8.8, 2.54, 8.9),
    new MeshBasicMaterial({ color: PAPER, side: BackSide, fog: false }),
  );
  light.position.set(26.6, 1.71, -200);
  entrance.add(light);

  // The front doors, hinged just inside the doorway so they swing open into the light.
  const doorMaterial = new MeshBasicMaterial({ map: doorTexture() });
  const doorInk = ink(PAPER, 1.4, 0.9);
  const doorHeight = DOOR_TOP - FLOOR;
  const doors = [[-204.5, 1], [-195.5, -1]].map(([z, dir]) => {
    const pivot = new Group();
    pivot.position.set(DOORWAY_X + 0.06, FLOOR, z);
    const leaf = box(0.12, doorHeight, 4.5, 0, doorHeight / 2, dir * 2.25, [dark, doorMaterial, dark, dark, dark, dark]);
    const edges = new EdgesGeometry(leaf.geometry);
    const local = [];
    const p = edges.attributes.position;
    for (let i = 0; i < p.count; i++) local.push(p.getX(i), p.getY(i), p.getZ(i));
    leaf.add(lines(local, doorInk));
    pivot.add(leaf);
    entrance.add(pivot);
    return { pivot, dir };
  });

  city.add(entrance);

  return {
    materials,
    setDoors(t) { doors.forEach(({ pivot, dir }) => { pivot.rotation.y = dir * t * 1.75; }); },
  };
}

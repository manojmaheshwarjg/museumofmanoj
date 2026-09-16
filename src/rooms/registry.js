// Every illustration, 4D effect and custom room layout, collected once so any part of the museum can draw them:
// the rooms themselves, the framed pictures on the 3D walls, the comic strips and the Easter eggs.

const collect = (mods, name) => Object.values(mods).reduce((all, mod) => ({ ...all, ...(mod[name] || {}) }), {});
const arts = import.meta.glob('./art-*.js', { eager: true });
const wings = import.meta.glob('./wing-*.js', { eager: true });

export const ART = collect({ ...arts, ...wings }, 'ART');
export const FX = collect(import.meta.glob('./fx-*.js', { eager: true }), 'FX');
export const WINGS = collect(wings, 'WINGS');

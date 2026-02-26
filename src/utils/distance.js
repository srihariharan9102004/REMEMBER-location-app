import L from "leaflet";

export function getDistance(pos1, pos2) {
  return L.latLng(pos1[0], pos1[1])
    .distanceTo(L.latLng(pos2[0], pos2[1]));
}

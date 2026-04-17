import { latLngInComma, type LatLngTuple } from "~/models";

export type ExternalMapLink = {
  label: string;
  urlGenerator: (latlng: LatLngTuple) => string;
};

export const externalMapLinks: ExternalMapLink[] = [
  { label: "Google Map", urlGenerator: googleMapURL },
  { label: "Apple Map", urlGenerator: appleMapURL },
  { label: "OpenStreetMap", urlGenerator: openStreetMapURL },
];

function googleMapURL(latlng: LatLngTuple): string {
  const baseURL = `https://www.google.com/maps`;
  const placePath = `/place/${latLngInComma(latlng)}`;
  const centerPath = `/@${latLngInComma(latlng)},19z`;

  return `${baseURL}${placePath}${centerPath}/`;
}

function appleMapURL(latlng: LatLngTuple): string {
  const baseURL = `https://maps.apple.com`;

  const query = new URLSearchParams([
    ["q", latLngInComma(latlng)],
    ["ll", latLngInComma(latlng)],
    ["sll", latLngInComma(latlng)],
    ["z", "19"],
  ]);

  const url = new URL("/", baseURL);
  url.search = "?" + query.toString();

  return url.toString();
}

function openStreetMapURL([lat, lng]: LatLngTuple): string {
  const baseURL = `https://www.openstreetmap.org/`;

  const query = new URLSearchParams([
    ["lat", lat.toString()],
    ["lon", lng.toString()],
    ["zoom", "18"],
  ]);

  const url = new URL("/search", baseURL);
  url.search = "?" + query.toString();
  url.hash = `18/${lat.toString()}/${lng.toString()}`;

  return url.toString();
}

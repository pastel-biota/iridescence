import "leaflet/dist/leaflet.css";

import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import MarkerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";
import { type FC } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { latLngInComma, type LatLngTuple } from "~/models";

if (typeof window !== "undefined") {
  // Leaflet refers to the wrong URL for the icons.
  // Make leaflet use bundler-provided URLs

  // @ts-expect-error: globally accepted idiom
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: MarkerIcon2x,
    iconUrl: MarkerIcon,
    shadowUrl: MarkerShadow,
  });
}

export type LeafletMapProps = {
  className: string;
  latlng: LatLngTuple;
};

export const LeafletMapImpl: FC<LeafletMapProps> = ({ className, latlng }) => {
  return (
    <MapContainer
      center={latlng}
      zoom={16}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={latlng}>
        <Popup>
          <span>Open in...</span>
          <ul>
            <li>
              <a
                href={googleMapURL(latlng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Map
              </a>
            </li>
            <li>
              <a
                href={appleMapURL(latlng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apple Map
              </a>
            </li>
            <li>
              <a
                href={openStreetMapURL(latlng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenStreetMap
              </a>
            </li>
          </ul>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

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

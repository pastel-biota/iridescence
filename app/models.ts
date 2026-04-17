export type Photo = {
  id: string;
  images: Record<string, ImageMeta>;
  representativeColor: string;
  shotTime: Date;
  properties: PhotoProperties | undefined;
};

export type PhotoReference = {
  id: string;
  representativeColor: string;
  images: Record<string, ImageMeta>;
};

export type PhotoViewReference = PhotoReference & {
  span: [rows: number, cols: number];
};

export type ImageMeta = {
  ext: string;
  mime: string;
  width: number;
  height: number;
  imageUrl: string;
};

export type LatLngTuple = [latitude: number, latitude: number];

export function latLngInComma([lat, lng]: LatLngTuple): string {
  return `${lat.toString()},${lng.toString()}`;
}

export type PhotoProperties = {
  version: 1;
  machine: string;
  lens: string | null;
  fNumber: number | null;
  focal: number | null;
  gpsLatLng: LatLngTuple | null;
  iso: number | null;
  shutterSpeed: number | null;
  shutterSpeedControlled: boolean | null;
};

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

export type ImageMeta = {
  ext: string;
  width: number;
  height: number;
  imageUrl: string;
};

export type PhotoProperties = {
  version: 1;
  gpsLngLat: [number, number] | null;
  machine: string;
  lens: string | null;
  fNumber: number | null;
  focal: number | null;
  gpsLatLng: number[] | null;
  iso: number | null;
  shutterSpeed: number | null;
  shutterSpeedControlled: boolean | null;
};

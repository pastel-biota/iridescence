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

export function getImageBySize(
  imagesMap: Record<string, ImageMeta>,
  desirableSize: number,
): ImageMeta | null {
  const images = Object.entries(imagesMap);
  if (images.length === 0) {
    return null;
  }

  const imageSize = images
    .map(([key, image]) => [key, Math.min(image.width, image.height)] as const)
    .map(([key, size]) => [key, Math.abs(size - desirableSize)] as const)
    .sort(([_, leftSize], [__, rightSize]) => leftSize - rightSize);

  const desirable = imageSize.at(0)?.at(0);
  if (desirable === undefined) {
    throw new Error(
      "Expected to have at least one image (the sorting did not yield anything)",
    );
  }

  const desirableImage = imagesMap[desirable];
  if (desirableImage === undefined) {
    throw new Error(
      "Expected to have at least one image (the desirable reference is not available)",
    );
  }

  return desirableImage;
}

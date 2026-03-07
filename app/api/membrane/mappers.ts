import z from "zod/v4";

import type {
  ImageMeta,
  Photo,
  PhotoProperties,
  PhotoReference,
} from "~/models";

import type { components } from "./schema";
import { getImageServeUrl } from "./url";

export function mapPhoto(photo: components["schemas"]["PhotoScheme"]): Photo {
  return {
    id: photo.id,
    images: photo.images.map((image) =>
      mapImageReference(photo.id, {
        // TODO: This is painful! Refactor to the complete subset on the backend
        id: image.image_id,
        ext: image.ext,
        width: image.width,
        height: image.height,
        mime: image.mime,
      }),
    ),
    shotTime: new Date(photo.shot_datetime),
    properties: photoProperties.safeParse(photo.properties).data,
    representativeColor: photo.representative_color,
  };
}

export function mapPhotoReference(
  photo: components["schemas"]["PhotoReferenceSchema"],
): PhotoReference {
  return {
    id: photo.id,
    representativeColor: photo.representative_color,
    images: photo.images.map((image) => mapImageReference(photo.id, image)),
  };
}

export function mapImageReference(
  photoId: string,
  imageMeta: components["schemas"]["ImageReferenceSchema"],
): ImageMeta {
  return {
    id: imageMeta.id,
    ext: imageMeta.ext,
    width: imageMeta.width,
    height: imageMeta.height,
    imageUrl: getImageServeUrl(photoId, imageMeta.id),
  };
}

const photoProperties = z
  .object({
    _v: z.literal(1).optional(),
    gps_lng_lat: z.tuple([z.number(), z.number()]).optional().nullable(),
    machine: z.string(),
    lens: z.string().nullable(),
    f_number: z.number().nullable(),
    focal: z.number().nullable(),
    gps_lat_lng: z.tuple([z.number(), z.number()]).nullable(),
    iso: z.number().nullable(),
    shutter_speed: z.number().nullable(),
    shutter_speed_controlled: z.boolean().nullable(),
  })
  .transform(
    (external) =>
      ({
        version: 1,
        gpsLngLat: external.gps_lng_lat ?? null,
        machine: external.machine,
        lens: external.lens,
        fNumber: external.f_number,
        focal: external.focal,
        gpsLatLng: external.gps_lat_lng,
        iso: external.iso,
        shutterSpeed: external.shutter_speed,
        shutterSpeedControlled: external.shutter_speed_controlled,
      }) satisfies PhotoProperties,
  );

import z from "zod/v4";

import type { components } from "~/api/iris/schema";
import { getImageServeUrl } from "~/api/iris/url";
import type {
  ImageMeta,
  Photo,
  PhotoProperties,
  PhotoReference,
} from "~/entities/photo/model";
import { mapObject } from "~/lib/data/map-object";

export function mapPhoto(photo: components["schemas"]["PhotoScheme"]): Photo {
  return {
    id: photo.id,
    images: mapObject(photo.images, (key, image) =>
      mapImageReference(photo.id, key, image),
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
    images: mapObject(photo.images, (key, image) =>
      mapImageReference(photo.id, key, image),
    ),
  };
}

export function mapImageReference(
  photoId: string,
  imageId: string,
  imageMeta: components["schemas"]["ImageMetaScheme"],
): ImageMeta {
  return {
    ext: imageMeta.ext,
    mime: imageMeta.mime,
    width: imageMeta.width,
    height: imageMeta.height,
    imageUrl: getImageServeUrl(photoId, imageId),
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

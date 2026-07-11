import { redirect } from "react-router";

import { irisClient } from "~/api/iris/client";
import { forwardSessionCookie } from "~/features/auth/cookie.server";

/**
 * Server-side fetch for the photo detail that forwards the caller's session
 * cookie to Iris. Returns the same raw payload shape as the browser queryFn,
 * so it can seed the react-query cache under an identical query key.
 */
export async function fetchPhotoDetail(photoId: string, request: Request) {
  const { data, error, response } = await irisClient.GET("/photos/{photo_id}", {
    params: {
      path: {
        photo_id: photoId,
      },
    },
    headers: forwardSessionCookie(request),
  });

  if (error !== undefined) {
    if (response.status === 401) {
      throw redirect("/login");
    }

    throw new Response("Failed to load photo detail from Iris", {
      status: response.status,
    });
  }

  return data;
}

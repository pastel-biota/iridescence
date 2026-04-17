import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.ts"),
  route("/photos", "routes/photos/page.tsx", [
    route(":id", "routes/photos/image/page.tsx"),
  ]),
  route("/api/photos", "routes/api/photos.ts"),
] satisfies RouteConfig;

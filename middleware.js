import { auth } from "./app/_lib/auth";

export const middleware = auth;
export const config = {
/* The `matcher: ["/account"]` in the `config` object is specifying that the middleware should be
applied only to requests that match the path "/account". This means that the `auth` middleware will
be triggered only for requests that have a URL path that matches "/account". */
  matcher: ["/account"],
};
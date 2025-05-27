export const protectedRoutes = ["/dashboard", "/projects"];
export const publicRoutes = ["/login", "/sign-up", "/"];

// Routes where the navbar should be hidden
export const hideNavbarRoutes = ["/login", "/sign-up", "/"];

export enum ERROR_TYPES {
  NOT_FOUND = -40,
  NOT_CREATED = -10,
  NOT_AUTHORIZED = -20,
}

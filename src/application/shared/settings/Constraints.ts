export class URLConstraint {
  static Users = {
    Refresh: { method: "get", path: "/v1/users/refresh" },
    SignUp: { method: "post", path: "/v1/users/signup" },
    SignIn: { method: "post", path: "/v1/users/signin" },
    Get: { method: "get", path: "/v1/users/get" }
  }

  static Links = {
    List: { method: "get", path: "/v1/links" },
    Create: { method: "post", path: "/v1/links" },
    Delete: { method: "delete", path: "/v1/links/:id" }
  }

  static Health = {
    Ping: { method: "get", path: "/ping" }
  }

  static Root = {
    Redirect: { method: "get", path: "/:path" }
  }
}

export { default } from "next-auth/middleware";//This
export const config = {
    matcher: [
        "/blog/template/:path*",
        "/admin/:path*",

    ]
}
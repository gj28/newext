import { NextResponse } from 'next/server';


export function middleware(request) {
    // Get the token from cookies
    const token = request.cookies.get('token');

    // Check if the token exists and is valid
    if (token) {
        // Check if the token is valid (this could be an additional server-side check if needed)
        // For now, we are assuming the token's presence means it's valid

        // Redirect to the profile page if accessing the login page
        if (request.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // Redirect to login page if no token is present and trying to access protected routes
        if (request.nextUrl.pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Proceed as usual if no redirect is needed
    return NextResponse.next();
}

// Define the paths where the middleware should apply
export const config = {
    matcher: ['/dashboard/:path*', '/'],
};
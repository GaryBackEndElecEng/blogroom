import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';
import { postPageHit } from "@lib/fetchTypes";
import prisma from '@_prisma/client';
import type { mainPageHit } from "@lib/Types";
import path from 'path';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // console.log("referrer", request.url)
    //CAN'T RUN PRISMA IN EDGE

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/blog/:path*', '/', "/posts:path*"]
}
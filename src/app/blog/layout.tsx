import React from 'react';
import type { Metadata } from 'next';
import BlogHeader from "@component/header/BlogHeader";
import GetError from "@component/comp/GetError"

export const metadata: Metadata = {
    title: {
        default: "Blogs",
        template: `%s | dashboard`,

    },
    description: "Generated by www.masterconnect.ca,Free Blog Creation for you. It provides templates that the user can use to become an effective blogger.This houses all published blogs.",
    keywords: ["The Blog Room, personalize dashboard", "dashboard", "bloggers", "free blog & posts", "customer's personal page", " Create Your Own Blog", "Gary's Blogs", "free custom build blogs"],

    // colorScheme:"light",

    openGraph: {
        title: "Blog.R-Dashboard",
        description: 'free advance blog-set-up for a starter',
        url: "https://www.garymasterconnect.com",
        siteName: "The Blog Room -Dashboard",
        images: [
            {
                url: "/images/gb_logo.png",
                width: 600,
                height: 600
            },

        ],

    },


}
export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <BlogHeader />
            <GetError />
            {children}
        </div>
    )
}

import React from 'react';
import type { Metadata } from 'next';
import BlogHeader from "@component/header/BlogHeader";

export const metadata: Metadata = {
    title: {
        default: "posts",
        template: `%s | all posts`,

    },
    description: "Generated by www.masterconnect.ca,Free Blog Creation for you.This page displays all available posts.",
    keywords: ["The Post Room, personalize FREE posts", "dashboard", "POSTS for bloggers", "free blog & posts", "customer's personal page", " Create Your Own Blog", "Gary's Blogs"],

    // colorScheme:"light",

    openGraph: {
        title: "Post Room",
        description: 'View free posts from important bloggers',
        url: "https://www.garymasterconnect.com",
        siteName: "The Blog Room - Post Room",
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
            {children}
        </div>
    )
}

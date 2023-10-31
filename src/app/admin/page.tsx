import React from 'react';
import AdminMain from "@/components/blogElements/MainAdmin";

export default function page() {
    // route for creating Mdx files with uploads to public. replace img filename with blogName+uuid=> write to public/blogs
    return (
        <div className="w-full">
            <AdminMain />
        </div>
    )
}

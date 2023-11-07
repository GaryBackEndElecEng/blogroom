"use server";
import React from 'react';
// import { getAccount } from "@lib/nextAuth";
import Posts from "@component/posts/Posts";
import { getPosts, getUsers } from "@lib/fetchTypes";
import type { postType, userType } from '@/lib/Types';


export default async function page() {
    const posts: postType[] | undefined = await getPosts() as postType[];
    const getusers: userType[] | undefined = await getUsers();
    return (
        <>
            <Posts get_users={getusers} get_posts={posts} />
        </>
    )


}



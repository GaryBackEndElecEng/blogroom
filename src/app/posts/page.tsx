"use server";
import React from 'react';
import { getAccount } from "@lib/nextAuth";
import Posts from "@component/posts/Posts";
import { getPosts, getUsers } from "@lib/serverGets";
import type { postType } from '@/lib/Types';

export default async function page() {
    const posts: postType[] = await getPosts() as postType[]
    const getusers = await getUsers()
    return (
        <Posts getUsers={getusers} />
    )


}



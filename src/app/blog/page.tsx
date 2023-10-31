
import React from 'react'
import AllBlogs from "@component/blog/AllBlogs";
import { getUsers } from "@lib/serverGets"
import { userType } from '@/lib/Types';



export default async function page() {
    const get_users: userType[] | undefined = await getUsers();
    return (

        <AllBlogs get_users={get_users} />

    )
}

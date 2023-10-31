"use server"
import React from 'react'
import InsertInputContext from "@component/blog/InsertInputContext";
import { getUsers } from "@lib/serverGets"
import { userType } from '@/lib/Types';

export default async function page() {
    const users: userType[] = await getUsers()
    return (

        <InsertInputContext users={users} />

    )
}

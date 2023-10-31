"use server"
import React from 'react'
import { getUsers } from "@lib/serverGets";
import UsersHomeLinks from "@/components/blog/users/UsersHomeLinks";

export default async function homelinks() {
    const get_users = await getUsers();
    return (
        <div>
            <UsersHomeLinks getusers={get_users} />
        </div>
    )
}

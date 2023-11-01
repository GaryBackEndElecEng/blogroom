"use server"
import React from 'react';
import InputContextInsert from "@/components/blog/dashboard/template/NOTUSEDHERE"
import { getUserAccount, getUsers } from "@lib/serverGets";


export default async function page() {
    const account = await getUserAccount();
    const getusers = await getUsers()
    const getuser = getusers.find((user) => (user.email === account.data?.email as string))

    return (
        <React.Fragment>
            <InputContextInsert account={account} getuser={getuser} />
        </React.Fragment>
    )

}


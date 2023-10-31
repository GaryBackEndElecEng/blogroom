"use server"
import React from 'react'
import MakeAPost from "@component/posts/MakeAPost";
import { getAccount, getUser } from '@/lib/nextAuth';
import { getUserFiles } from "@lib/serverGets";
import Login from "@component/comp/Login";

export default async function page() {
    const getaccount = await getAccount();
    const getuser = await getUser();
    const getuserfiles = await getUserFiles();
    if (getaccount && getaccount.data?.status === "authenticated") {
        return (
            <div>
                <MakeAPost
                    getAccount={getaccount}
                    getuser={getuser}
                    getuserfiles={getuserfiles}
                />
            </div>
        )
    } else {
        return (
            <div className="grid place-items-center h-screen">
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-center text-3xl mb-3 font-bold">
                        please login to post a message
                    </h3>
                    <Login />
                </div>
            </div>
        )
    }
}

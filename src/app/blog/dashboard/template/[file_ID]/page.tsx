
import React from 'react';
import type { fileType } from '@/lib/Types';
import { getUser, getFile } from "@lib/serverGets"
import { getAccount, } from "@lib/nextAuth";
import InsertInputContext from "@component/blog/dashboard/InsertInputContext";

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local


export default async function FileHandle({ params }: { params: { file_ID: string } }) {
    const { file_ID } = params;
    const file = await getFile(file_ID);
    const account = await getAccount();
    const get_user = await getUser();
    if (file && account && get_user) {
        return (
            <>
                <InsertInputContext
                    file={file}
                    get_user={get_user}
                    get_account={account}
                />
            </>
        )
    } else {
        <div className="grid place-items-center">
            <h3 className="text-2xl text-center font-bold">...could not find file</h3>
        </div>
    }
}

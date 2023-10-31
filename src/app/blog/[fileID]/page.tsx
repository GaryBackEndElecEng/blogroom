
import React from 'react';
import { getAllFiles } from "@lib/fetchTypes";
import { fileType, userType } from '@/lib/Types';
import UserBlogItem from "@/components/blog/UserBlogItem";
import { getFile } from "@lib/serverGets";

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

type params = {
    fileID: string
}
// export async function generateStaticParams(): Promise<params[]> {
//     // const users: userType[] | [] = await getUsers() as userType[];
//     const res = await fetch(`${url}/api/getusers`);
//     const users = await res.json() as userType[]
//     let arr: { fileID: string }[] = [];
//     // if (!users) return
//     users.map((user, index) => {
//         user.files.map((file) => {
//             if (file) {
//                 arr.push({ fileID: file.id })
//             }
//         })


//     });
//     return arr
// }

export default async function page({ params }: { params: { fileID: string } }) {
    //NOTE YOU CAN NOT FETCH USING AXIOS @SERVER LEVEL
    const fileID = params.fileID;
    const file = await getFile(fileID as string)


    return (
        <div>

            {file ?

                <UserBlogItem file={file} />
                :
                <div className="text-center-text-2xl font-bold">Could not find the username</div>

            }
        </div>
    )
}

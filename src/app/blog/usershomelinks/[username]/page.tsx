
import React from 'react';
import { getUsers } from "@lib/serverGets";
// import { getUsers } from "@lib/fetchTypes";
import UserNameBlogs from "@/components/blog/users/UserNameBlogs";
import type { Metadata, ResolvingMetadata } from 'next';
// import {usershomelinks_Metadata} from "@meta/dynamicMeta";
import { userType } from '@/lib/Types';

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

type params = {
    username: string
}

// export async function generateStaticParams(): Promise<params[]> {
//     const res = await fetch(`${url}/api/getusers`);
//     const users: userType[] = await res.json();
//     const genparams = users.map((user, index) => {
//         return { username: user.name }
//     });
//     return genparams as params[]
// }

export default async function userNames({ params }: { params: { username: string } }) {
    const get_users = await getUsers();

    const { username } = params;
    const decodeUsername = decodeURIComponent(username)
    if (!get_users) return
    const get_user = get_users.find(user => (user.name === decodeUsername))

    if (get_user) {
        return (
            <UserNameBlogs username={decodeUsername} getuser={get_user && get_user} />
        )
    } else {
        return (
            <div className="grid place-items-center h-screen">
                <h2 className="text-center mx-auto text-slate-200">
                    could not find the user you are looking for
                </h2>
            </div>
        )
    }
}

type Props = {
    params: { username: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const username = params.username

    // fetch data
    const user_name = decodeURIComponent(username)
    const res = await fetch(`${url}/api/getusermeta?username=${user_name}`);
    const body: userType = await res.json();
    const image = (body && body.image) ? body.image : "/images/gb_logo.png"

    // console.log("BIO", body?.bio, body)
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];
    const prevDesc = (await parent).description;
    const prevKwds = (await parent).keywords;
    const bio = (body && body.bio && prevDesc) ? [body.bio, prevDesc].join(": general :") : `${user_name} home blog page where interesting blogs can be found`;


    return {
        title: `${user_name}- Blog Room Page`,
        description: bio,
        authors: [{ name: user_name }, { name: "Gary Wallace" }],
        keywords: prevKwds && [...prevKwds, `${user_name}`, `${user_name} home page`],
        creator: user_name,
        publisher: user_name,
        openGraph: {
            images: [image, ...previousImages],
            description: `${body && body.bio && body.bio} - test here`
        },
    }
}

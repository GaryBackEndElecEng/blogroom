"use client"
import React from 'react'
import type { postType, userType } from "@lib/Types";
import { GeneralContext } from '../context/GeneralContextProvider';
import styles from "./posts.module.css";
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate";
import { getUserObj } from '@/lib/generalFunc';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getPosts } from '@/lib/fetchTypes';
import PostItem from "@component/posts/PostItem";
import Header from "./Header";
import { useRouter } from "next/navigation";

type mainType = {
    getUsers: userType[]
}
export default function Posts({ getUsers }: mainType) {
    const router = useRouter();
    const pathname = usePathname();
    const { setPosts, setPageHit, posts, setUsers } = React.useContext(GeneralContext);

    React.useEffect(() => {
        if (!pathname) return
        setPageHit({ page: pathname, name: "none" });
        setUsers(getUsers)
    }, [pathname, setPageHit, getUsers, setUsers]);

    React.useMemo(async () => {
        const getposts = await getPosts();
        if (!getposts) return
        setPosts(getposts);
    }, [setPosts]);

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, postId: number | undefined) => {
        e.preventDefault()
        if (!(postId)) return
        router.push(`/posts/${postId}`);
    }

    return (
        <React.Fragment>
            <Header />
            <div className="lg:container mx-auto px-1 sm:px-0 my-2">
                <div className="flex flex-col mx-auto min-h-[15vh] justify-center align-center mb-3">
                    <Link href={"posts/makeapost"} className="mx-auto">
                        <button className="button">make a post</button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2 lg:gap-6 mx-auto my-2 px-2 sm:px-3">
                    {posts && posts.length > 0 &&
                        posts.sort().map((post, index) => {
                            const user = getUserObj(getUsers, post.userId);
                            const date = post.date && getFormattedDate(post.date)
                            return (
                                <div className="col-span-1 mx-auto flex flex-col items-center" key={index}>
                                    <PostItem post={post} user={user} date={date} />
                                    {post && post.id && <button className="buttonsm" onClick={(e) => handleLink(e, post.id)}>Detail view</button>}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

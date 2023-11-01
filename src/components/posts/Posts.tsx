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
import { getPosts, getUsers } from '@/lib/fetchTypes';
import PostItem from "@component/posts/PostItem";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { msgType } from '@/types_';
import Msg from "@component/posts/Msg";

type mainType = {
    get_users: userType[] | undefined
    get_posts: postType[] | undefined
}
export default function Posts({ get_users, get_posts }: mainType) {
    const router = useRouter();
    const pathname = usePathname();
    const { setPosts, setPageHit, posts, setUsers, users, setMsg, msg } = React.useContext(GeneralContext);
    const [message, setMessage] = React.useState<msgType>({} as msgType)

    React.useEffect(() => {
        if (!pathname) return
        setPageHit({ page: pathname, name: "none" });
    }, [pathname, setPageHit]);

    React.useEffect(() => {
        if (get_users) {
            setUsers(get_users);
            setMessage({ loaded: true, msg: "users recieved" })
        } else {
            setMessage({ loaded: false, msg: "no users" })
        }
    }, [setUsers, get_users, setMsg]);

    React.useEffect(() => {
        // const getposts = await getPosts();
        if (get_posts) {
            setPosts(get_posts);
            setMsg({ loaded: true, msg: "recieved" });
        } else {
            setMsg({ loaded: false, msg: "no posts" });
        }
    }, [setPosts, get_posts, setMsg]);

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, postId: number | undefined) => {
        e.preventDefault()
        if (!(postId)) return
        router.push(`/posts/${postId}`);
    }

    return (
        <React.Fragment>
            <Header />
            <div className="lg:container mx-auto px-1 sm:px-0 my-2 ">
                <div className="relative h-[10vh]">
                    <div className="absolute mx-auto top-0 inset-0">
                        <Msg msg={message} setMsg={setMessage} />
                    </div>
                    {/* <div className="absolute mx-auto top-15 inset-0 ">
                        <Msg msg={msg} setMsg={setMsg} />
                    </div> */}
                </div>
                <div className="flex flex-col mx-auto min-h-[10vh] justify-center align-center mb-3">
                    <Link href={"posts/makeapost"} className="mx-auto">
                        <button className="button">makeapost</button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2 lg:gap-6 mx-auto my-2 px-2 sm:px-3">
                    {posts && posts.length > 0 &&
                        posts.sort().map((post, index) => {
                            const user = getUserObj(users, post.userId);
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

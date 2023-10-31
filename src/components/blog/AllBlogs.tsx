"use client";
import React from 'react';
import { getAllFiles } from "@lib/fetchTypes";
import { msgType, type fetchAllType, fileType, userType } from "@lib/Types";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileItem from "./FileItem";
import { InputContext } from "@context/InputTypeProvider";
import Button from '../comp/Button';
import { GeneralContext } from '../context/GeneralContextProvider';
import styles from "./allblogs.module.css"

type fetchType = {
    data: { id: string, filename: string }[],
    message: string
} | {
    data: string[],
    message: string
}
type slugType = [
    { jsonid: string },
    { filename: string }
]




export default function AllBlogs({ users }: { users: userType[] }) {
    const { allFiles, setAllFiles } = React.useContext(InputContext);
    const { setPageHit } = React.useContext(GeneralContext)

    const [user, setUser] = React.useState<userType | undefined>();
    const [fileID, setFileID] = React.useState<string | undefined>();

    const [msg, setMsg] = React.useState<msgType>({} as msgType);

    React.useEffect(() => {
        setPageHit({ page: "/blog", name: "none" });
        if (window.scrollY) {
            window.scroll(0, 0)
        }
    }, [setPageHit]);

    React.useMemo(async () => {
        async function getFiles() {
            const allBlogs: fileType[] | undefined = await getAllFiles();
            if (allBlogs) {
                setMsg({ loaded: true, msg: "recieved" });
                return setAllFiles(allBlogs);
            } else {
                setMsg({ loaded: false, msg: "no blogs" });
            };
        }
        await getFiles()
    }, []);

    const container = "allBlog_container mx-auto lg:container flex flex-col p-2 mt-5 gap-3  w-full items-center"
    const linkContainer = "allBlog_subContainer flex flex-col gap-1 p-1 justify-start items-center w-full grid-cols-1 sm:grid sm:grid-cols-2 sm:place-items-center sm:gap-2 "

    return (
        <React.Fragment>
            <div className={container}>
                <div className="flex justify-center items-center">
                    <blockquote className={`learningIsLiving allBlogs_mainText text-xl sm:text-4xl text-white text-center mx-auto italic mb-3  `}>
                        <q>learnng is living</q>
                    </blockquote>
                </div>

                <section className={linkContainer}>
                    {allFiles && msg.loaded ? (
                        allFiles.map((item, index) => {
                            if (item.published) {
                                return (
                                    <React.Fragment key={index}>
                                        <FileItem file={item} index={index} users={users} />
                                    </React.Fragment>
                                )
                            }
                        }
                        )
                    ) : (<h4 className="button text-white">{msg.msg}</h4>)}
                </section>
                <Link href="/">
                    <Button color={"emerald"} border={true}>home</Button>
                </Link>
            </div>
        </React.Fragment>
    )
}

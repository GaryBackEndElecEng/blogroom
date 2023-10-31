"use client"
import React from 'react';
import { Heading, Section, Summary, SubHeading, Conclusion, type_, ImageJsx, FileContent, Question, HLink, ListComp } from "@blogElement/elements";
import type { fetchSingleFileType, fileType, msgType, userType } from "@lib/Types";
import { inputArr } from "@lib/Types";
import Button from '../comp/Button';
import Link from 'next/link';
import getFormattedDate from "@lib/getFormattedDate";
import Image from 'next/image';
// import { InputContext } from '../context/InputTypeProvider';
import { GeneralContext } from '../context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import UserSignatureBlock from "./UserSignatureBlock";
import BlogLike from "@component/blog/BlogLike";
import FileRate from "@component/blog/FileRate";
import { getUser } from '@/lib/fetchTypes';


type mainBlogItemType = {
    file: fileType
}

export default function UserBlogItem({ file }: mainBlogItemType) {
    const pathname = usePathname();
    const { setPageHit, setUser, user } = React.useContext(GeneralContext);
    const [getData, setGetData] = React.useState<fetchSingleFileType>({} as fetchSingleFileType);
    const [msg, setMsg] = React.useState<msgType>({} as msgType);
    const noUserUrl = "/blog/usershomelinks"
    const [retUrl, setRetUrl] = React.useState<string>(noUserUrl);

    React.useMemo(async () => {
        if (!(file && file.userId)) return;
        const getuser = await getUser(file.userId)
        if (!getuser) return
        setUser(getuser)
    }, [file, setUser]);

    React.useEffect(() => {
        if (!(user && user.name)) return
        if (!pathname) return
        let username = encodeURIComponent(user.name);
        let url = `/blog/usershomelinks/${username}`
        setRetUrl(url);
        setPageHit({ name: username, page: pathname })
    }, [setPageHit, user, pathname]);


    const container = "w-full lg:container mx-auto";
    const msg_ = type_("msgAbs");
    const msgFalse = type_("msgfalse");
    const msgTrue = type_("msgTrue");

    const dateToStr = file.date && getFormattedDate(file.date);
    // console.log(file)
    return (
        <div className={container}>
            <div className="flex flex-col justify-start items-center relative">
                <div className={msg_ && msg_.item1}>
                    {msg.loaded ? (
                        <div className={msgTrue && msgTrue.item1}>{msg.msg}</div>
                    ) : (<div className={msgFalse && msgFalse.item1}>{msg.msg}</div>)}
                </div>
                <div className={"leading-6 flex flex-row flex-wrap gap mt-0"}>
                    <h6 className="font-bold">By:{user && user.name},</h6>
                    <small className="font-bold">{dateToStr && JSON.stringify(dateToStr)}</small>
                </div>

            </div>
            <div className="mx-auto lg:container px-2 my-2 flex flex-col items-center">
                <FileContent file={file} />
            </div>
            <div className="mx-auto lg:container">
                {file && file.inputTypes?.length!! &&
                    file.inputTypes.map((input, index) => {
                        const check = inputArr.find(name => (name === input.name)) ? true : false;
                        if (!(check)) return
                        return (
                            <React.Fragment key={index}>
                                <Heading input={input} />
                                <SubHeading input={input} />
                                <ImageJsx input={input} />
                                <Summary input={input} />
                                <Section input={input} />
                                <Conclusion input={input} />
                                <Question input={input} />
                                <HLink input={input} />
                                <ListComp input={input} />
                            </React.Fragment>
                        )
                    })
                }
            </div>
            <h3 className="text-xl text-center mb-3 underline underline-offset-8 text-slate-300"> <span className="text-slate-100">Rate Me</span> -<q className="italic"> rating helps what you want</q></h3>
            <div className="flex flex-col justify-center items-center prose prose-md px-3 mx-auto ">
                <BlogLike file={file} />
            </div>
            <div className="flex flex-col justify-center items-center prose prose-md px-3 mx-auto ">
                <FileRate file={file} />
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <UserSignatureBlock file={file} user={user} />
            </div>
            <div className="flex flex-col justify-center items-center w-full">

                <Link href={retUrl}>
                    <Button color={"emerald"} border={true} >return </Button>
                </Link>
            </div>
        </div>
    )
}

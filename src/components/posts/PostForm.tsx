"use client";
import React from 'react'
import { getAccount } from '@lib/nextAuth';
import { fileType, postType, userAccountType, userType } from '@/lib/Types';
import { GeneralContext } from '../context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import { imgPostUploadToS3 } from '@/lib/s3ApiComponents';
import { sendPost } from '@/lib/fetchTypes';
import { FormControl, FormLabel, TextField } from '@mui/material';

type fileUrlType = {
    name: string,
    url: string
}
type mainAccType = {
    getAccount: userAccountType | null,
    getuser: userType | null,
    userFiles: fileType[]
}
export default function PostForm({ getAccount, getuser, userFiles }: mainAccType) {
    const pathname = usePathname();
    const { setPageHit, setAccount, account, setPosts, posts, setUser, user, setPost, post, setMsg, msg, setUserPosts, userPosts } = React.useContext(GeneralContext);
    const [imgFile, setImgFile] = React.useState<File>({} as File);
    const [imgTemp, setImgTemp] = React.useState<File>({} as File);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [fileUrls, setFileUrls] = React.useState<fileUrlType[] | null>(null);

    React.useEffect(() => {
        if (userFiles) {
            let arr: fileUrlType[] = [{ name: "select a file", url: "none" }]
            userFiles.forEach((file, index) => {
                arr.push({ name: file.name, url: file.fileUrl })
            });
            setFileUrls(arr)

        }
    }, [setFileUrls, userFiles]);

    React.useEffect(() => {
        if (!getAccount || !getuser) return
        setAccount(getAccount);
        setUser(getuser)
    }, [getAccount, setAccount, setUser, getuser]);

    React.useEffect(() => {
        if (!pathname || !getAccount || !getAccount.data) return
        setPageHit({ page: pathname, name: getAccount?.data?.name });
    }, [pathname, setPageHit, getAccount]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return
        setIsLoading(true);
        const data = await imgPostUploadToS3(e, user);
        setIsLoading(false);
        if (!data) { return setMsg({ loaded: false, msg: "image was not saved" }) }
        setMsg({ loaded: true, msg: "saved" })
        const { key } = data;
        const temp: postType = { ...post, s3Key: key, userId: user.id };
        setPost(temp);
        const recPost = await sendPost(temp);
        if (recPost) { setPosts([...posts, recPost]); setMsg({ loaded: true, msg: "saved" }) }
        else { setPosts([...posts, temp]); setMsg({ loaded: false, msg: "post was not saved" }) };

        setImgFile({} as File)
        setPost({} as postType)
    }
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.currentTarget) {
            setPost({
                ...post,
                [e.currentTarget.name]: e.currentTarget.value
            })
        }
    }

    return (
        <div className="lg:container mx-auto sm:px-0 my-2 w-full sm:3/4 lg:w-1/2 ">
            <div className="flex flex-col items-center justify-center gap-1 p-1 mx-auto">
                {msg.loaded ? (
                    <div className="text-center text-blue-900 text-2xl">{msg.msg}</div>
                ) : (
                    <div className="text-center text-red-900 text-2xl">{msg.msg}</div>
                )
                }
            </div>
            <form action="" onSubmit={handleSubmit}
                className="w-full sm:w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-1 p-1 mx-auto bg-slate-200 rounded-lg shadow shadow-emerald-300 border border-emerald-900 bg-slate-200 "
            >
                <FormControl className=" text-black w-full mx-auto flex flex-col items-center">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Title/subject"
                        aria-label="name"
                        value={post.name ? post.name : " "}
                        onChange={handleOnChange}
                        className="rounded-lg shadow shadow-emerald-300 bg-white"
                    />
                </FormControl>
                <FormControl className=" text-black w-full mx-auto flex flex-col items-center">
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                setImgFile(file)
                            }
                        }}
                    />
                </FormControl>
                <TextField
                    label={"Content"}
                    aria-label="content"
                    id={`${post.name}-content`}
                    required
                    fullWidth={true}
                    multiline={true}
                    placeholder={"write a story/thought or statement"}
                    helperText={"something interesting or relevant"}
                    minRows={4}
                    maxRows={20}
                    value={post.content ? post.content : " "}
                    type="text"
                    name="content"
                    onChange={handleOnChange}
                    className="rounded-lg shadow shadow-emerald-300 bg-white w-full mx-auto flex flex-col items-center"
                />
                <FormControl className=" text-black w-full mx-auto flex flex-col items-center">
                    <FormLabel htmlFor="bloglink">select a blog</FormLabel>
                    <select
                        id="bloglink"
                        name="bloglink"
                        placeholder="link to blog"
                        aria-label="bloglink"
                        value={post.bloglink ? post.bloglink : " "}
                        onChange={(e) => {
                            setPost({ ...post, bloglink: e.target.value })
                        }}
                        className="rounded-lg shadow shadow-emerald-300 bg-white"
                        style={{ width: "fit-content" }}
                    >
                        {fileUrls && fileUrls.map((obj, index) => {


                            return (
                                <React.Fragment key={index}>
                                    <option value={obj.url}>{obj.name}</option>
                                </React.Fragment>
                            )

                        })}
                    </select>
                </FormControl>
                <button className="button my-2 text-black" type="submit">post it</button>
            </form>
        </div>
    )
}
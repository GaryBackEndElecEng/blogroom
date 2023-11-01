"use client";
import React from 'react';
import type { fileType, userType } from "@lib/Types";
import Image from 'next/image';
import { GeneralContext } from '@context/GeneralContextProvider';
import { Heading, Section, Summary, SubHeading, Conclusion } from "@component/blogElements/elements";
import { getuserFiles } from "@lib/fetchTypes";
import getFormattedDate from "@lib/getFormattedDate"
import Link from 'next/link';
import { usePathname } from "next/navigation";


type usernameType = {
    getuser: userType | undefined

}
export default function UserNameBlogs({ getuser }: usernameType) {
    const pathname = usePathname();
    const [usersFiles, setUsersFiles] = React.useState<fileType[] | []>([]);
    const { client, setClient, setPageHit } = React.useContext(GeneralContext);
    const [numFiles, setNumFiles] = React.useState<number>(1);

    React.useEffect(() => {
        //pathname=>/blog/usershomelinks/Bob%20Brown
        if (pathname && getuser && getuser.name) {
            const params = new URLSearchParams();
            const username = pathname.split("/")[3];
            params.set(getuser.name, username);
            setPageHit({ name: getuser.name, page: pathname })
        }
    }, [getuser, setPageHit, pathname]);

    React.useEffect(() => {
        if (usersFiles) {
            setNumFiles(usersFiles.length)
        }
    }, [usersFiles]);


    React.useMemo(async () => {
        if (!(getuser && getuser.email)) return
        // console.log(get_user.email) //works
        const email: string = getuser.email
        const getUsersFiles = await getuserFiles(getuser.id)
        if (!getUsersFiles) return
        setUsersFiles(getUsersFiles);
        setClient(getuser)
    }, [getuser, setClient])

    const link = "/blog/usershomelinks/"
    const flexcol = "flex flex-col mx-auto w-full px-3 my-2";
    const title = "text-center font-bold text-4xl";
    const title1 = "text-center font-bold text-3xl";
    return (
        <main className="mx-auto lg:container my-2 px-3 mb-3">
            <h3 className={title}>{getuser && getuser.name}</h3>
            <h3 className="text-center font-bold text-xl">Welcome</h3>
            <section className=" mx-auto my-2 mb-6 w-full sm:w-7/8 lg:w-3/4 mx-auto px-3">
                <p className="my-1 sm:px-3 text-xl sm:leading-10">{getuser && getuser.bio}</p>
            </section>

            <h3 className="text-center text-[white]  underline underline-offset-8 text-2xl my-3 mb-[3vh]">blogs</h3>

            <section className={numFiles && numFiles === 1 ? `grid grid-cols-1 mx-auto my-2 gap-4 mx-auto px-3` : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto my-2 gap-4 mx-auto sm:px-3 mb-4"}>
                {usersFiles && usersFiles.map((file, index) => {
                    if (file.published) return (
                        <main key={index} className="col-span-1 card  ">
                            {file.imageUrl && <Image src={file.imageUrl} width={600} height={400} className="aspect-video" alt={`${file.name}-${client && client.name}`} />}
                            <Link href={`${link}/${client && client.name && client.name.replace(" ", "-")}/${file.id}`} className={flexcol} >
                                <div className={" m-auto"}>
                                    <h3 className={title1}>{file.title}</h3>
                                    <div className={flexcol}>
                                        <p className="sm:mx-auto text-xl sm:leading-10">{file.content}</p>
                                    </div>
                                    <div className="flex-flex-row flex-wrap justify-content">
                                        <small className="my-2 mx-auto">{client && client.name}</small>
                                        <small className="my-2 mx-auto">{(file && file.date) && getFormattedDate(file?.date)}</small>

                                    </div>
                                </div>
                            </Link>

                        </main>
                    )
                })}
            </section>
        </main>
    )
}

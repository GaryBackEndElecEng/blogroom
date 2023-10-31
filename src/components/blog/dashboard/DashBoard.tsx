"use client";
import { fileType, postType, userAccountType, userType } from '@/lib/Types';
import React from 'react'
import Login from "@component/comp/Login";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { GeneralContext } from '@/components/context/GeneralContextProvider';
import { getUserPosts, user_files } from "@lib/fetchTypes";
import DashBoardOptions from "@/components/blog/dashboard/DashBoardOptions";
import GenFileItem from "@/components/blog/dashboard/template/GenFileItem";
import Link from 'next/link';
import DashBoardOptionBio from "@/components/blog/dashboard/DashBoardOptionBio";
import { usePathname } from "next/navigation";
import { InputContext } from '@/components/context/InputTypeProvider';

type mainContextType = {
    account: userAccountType,
    getuser: userType
}
export default function DashBoard({ account, getuser }: mainContextType) {
    const pathname = usePathname();
    const { setPageHit, setUser, user, setUserPosts, userPosts } = React.useContext(GeneralContext);
    const { setUserFiles, userFiles } = React.useContext(InputContext);
    const [cols, setCols] = React.useState<number>(0);

    React.useEffect(() => {
        if (!pathname || !user || !user.name) return
        setPageHit({ page: pathname, name: user.name });
    }, [setPageHit, user, pathname]);

    React.useEffect(() => {
        setUser(getuser);
    }, [getuser, setUser]);

    React.useMemo(async () => {
        if (!(account && account.data)) return
        //BELOW RETURNS ALL inputtypes, && likes and rates)
        const userfiles: fileType[] | undefined = await user_files(account.data.email);
        if (userfiles && userfiles.length!!) {
            setUserFiles(userfiles);
            setCols(userfiles.length);

        }
    }, [setUserFiles, account]);

    React.useMemo(async () => {
        if (!(account && account.data)) return
        // includes likes and rates
        const userID: string = account.data.id;
        const userPosts: postType[] | undefined = await getUserPosts(userID);
        if (userPosts && userPosts.length!!) {
            setUserPosts(userPosts);


        }
    }, [setUserPosts, account]);

    const button = "flex flex-row justify-center items-center px-5 py-1 bg-emarald-600 shadow shadow-orange-500 border border-orange-800 rounded-full"
    const grid = cols < 3 ? ("mx-auto grid grid-cols-1 sm:grid-cols-2") : cols < 2 ? (" mx-auto grid grid-cols-1 ") : (" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")

    if (account.loaded) {
        return (
            <div className="mx-auto md:container">
                <h3 className="text-center my-3">Welcome</h3>
                <details>
                    <summary className="font-bold text-center mt-2 text-xl cursor-pointer">
                        <KeyboardArrowLeftIcon sx={{ color: "orange", ml: 1, mr: 1 }} />
                        Your options are below
                        <KeyboardArrowRightIcon sx={{ color: "orange", ml: 1, mr: 1 }} />
                    </summary>

                    <DashBoardOptions
                        account={account}
                        userFiles={userFiles}
                        userPosts={userPosts}
                    />
                    <DashBoardOptionBio />
                </details>
                <div className="mx-auto lg:container lg:px-3 my-2">

                    <div className={grid}>
                        {
                            userFiles && userFiles.length!! && userFiles.map((file, index) => (
                                <div className="card" key={index}>
                                    <GenFileItem get_file={file} />
                                    <Link href={`/blog/dashboard/template/${file.id}`}>
                                        <button className={button}>edit</button>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="mx-auto lg:container grid place-items-center h-[50vh]">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="text-center font-bold mb-3">free customizable blog. signin/Signup and use it to your discretion</h3>
                    <Login />
                </div>
            </div>
        )
    }
}
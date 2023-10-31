"use client"
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import Button from "@component/comp/Button";
import MainLinks from "@component/home/MainLinks";
import { GeneralContext } from '@/components/context/GeneralContextProvider';
import { userAccountType } from "@/lib/Types";
// import SubHeader from "@component/header/SubHeader";


export default function Home({ account }: { account: userAccountType | undefined }) {
    const linkRef = React.useRef(null);
    const { setPageHit } = React.useContext(GeneralContext);
    const [show, setShow] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (window.scrollY) {
            window.scroll(0, 0)
        }
        setPageHit({ page: "/home", name: "none" })
    }, [setPageHit]);




    return (
        <main className="flex min-h-[50vh] flex-col items-center justify-center  " >
            <MainLinks account={account} />
        </main>
    )
}

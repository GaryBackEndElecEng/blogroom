"use client";
import React from 'react';

import { GeneralContext } from "@context/GeneralContextProvider";
import AllBlogs from "@component/blog/AllBlogs";
import { userType } from '@/lib/Types';
import { usePathname } from "next/navigation";


export default function InsertInputContext({ users }: { users: userType[] }) {
    const pathname = usePathname();
    const { setPageHit } = React.useContext(GeneralContext);

    React.useEffect(() => {
        if (window.scrollY) {
            window.scroll(0, 0);
        }
    }, []);
    React.useEffect(() => {
        if (!pathname) return
        setPageHit({ page: pathname, name: "blog" });
    }, [setPageHit, pathname]);

    return (

        <AllBlogs users={users} />

    )
}

"use client";
import React from 'react';
import { userType } from "@lib/Types";
import Image from 'next/image';
import Button from "@component/comp/Button"
import Link from 'next/link';
import { GeneralContext } from '@context/GeneralContextProvider';
import { usePathname } from "next/navigation";

type usersTypes = {
    getusers: userType[] | undefined,
}
export default function UsersHomeLinks({ getusers }: usersTypes) {
    const { setPageHit } = React.useContext(GeneralContext);
    const pathname = usePathname();
    const logo = "/images/gb_logo.png";
    const custGrid3 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:container mx-auto gap-4 px-1 sm:px-0";
    const custGrid2 = "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:container mx-auto";
    const custGrid1 = "grid grid-cols-1 lg:container mx-auto";
    const custGrid = (getusers && getusers.length > 2) ? custGrid3 : custGrid2;

    React.useEffect(() => {
        if (!pathname) return
        setPageHit({ page: pathname, name: "none" });
        if (window.scrollY) {
            window.scroll(0, 0);
        }
    }, [pathname, setPageHit]);


    if (getusers) {
        return (
            <div className={custGrid}>
                {
                    getusers.map((user, index) => (
                        <div key={index} className="card p-2">
                            <div className="flex flex-row flex-wrap px-2 my-2 justify-center items-center gap-4 mx-auto">
                                {user.image ? <Image src={user.image} width={75} height={75} alt={`${user.name}`} className="imageRnd" />
                                    :
                                    <Image src={logo} width={75} height={75} alt={`${user.name}`} className="imageRnd" />
                                }
                                <h3 className="text-xl font-bold font-bold">{user.name}</h3>
                            </div>
                            <h3 className="text-xl font-bold my-2 px-1">Description</h3>
                            <p className="mx-auto px-1">{user.bio}</p>
                            <Link href={`/blog/usershomelinks/${user.name?.replace(" ", "-")}`} >
                                <Button color={"emerald"} shade={"lightgrey"} border={true}
                                > GOTO home page</Button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        )
    } else {
        <div className="flex flex-col items-center justify-center lg:container mx-auto">
            <h3 className="text-center text-2xl font-bold">...loading</h3>
        </div>
    }
}

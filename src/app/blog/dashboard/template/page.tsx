import React from 'react'
import TemplateChld from "@component/blog/dashboard/template/TemplateChld";
import { getAccount, getUser } from "@lib/nextAuth";
import Button from "@component/comp/Button";
import Link from 'next/link';
import { userType } from '@/lib/Types';



export default async function template() {
    const account = await getAccount();
    const get_user = await getUser();
    const loggedIn = () => {
        let login: boolean = false;
        if (account && account.loaded && account.data?.email) {
            login = true
        }
        return login
    }
    const isLoggedIn = loggedIn();
    return (
        <>
            {isLoggedIn ?
                (<TemplateChld account={account} getUser={get_user as userType} />)
                :
                (<div className="flex flex-col items-center justify-center gap-4 lg:gap-1 mx-auto container mt-10 h-[20vh] px-3">
                    <h2 className="text-center m-auto font-bold">make your own post</h2>
                    <h4 className="my-3 text-center mx-auto">Have Your own link and ownership to show the world.</h4>
                    <div className="flex flex-row items-center justify-center gap-4 lg:gap-1 mx-auto container mt-10 h-[20vh]">

                        <Link href={"/api/auth/signin"} className="m-auto">
                            <Button border={true} color={"white"} shade={"lightgrey"}>
                                <h2 className="text-lg text-center mx-auto">signin?</h2>
                            </Button>
                        </Link>
                        <Link href={"/register"} className="m-auto">
                            <Button border={true} color={"white"} shade={"rgba(150,250,175,.06)"}>
                                <h2 className="text-lg text-center mx-auto">register?</h2>
                            </Button>
                        </Link>
                    </div>

                </div>)

            }
        </>

    )
}

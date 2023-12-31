"use client"
import React from 'react'
import Template1 from "@/components/blog/dashboard/template/Template1NOTUSED";
import InputTypeProvider, { InputContext } from "@context/InputTypeProvider";
import { userAccountType, userType, } from '@/lib/Types';
import { GeneralContext } from '@/components/context/GeneralContextProvider';




type mainType = {
    account: userAccountType | undefined,
    getUser: userType | undefined
}
export default function TemplateChld({ account, getUser }: mainType) {
    const { setAccount, setUser } = React.useContext(GeneralContext);
    const { select, file, } = React.useContext(InputContext);
    React.useEffect(() => {
        if (!(account && account.loaded)) return
        setAccount(account);
        if (!getUser) return
        setUser(getUser);
    }, []);



    return (
        <InputTypeProvider>
            <Template1 account={account} user={getUser} />
        </InputTypeProvider>
    )
}

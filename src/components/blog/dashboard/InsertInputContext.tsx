"use client"
import React from 'react';
import InputTypeProvider, { InputContext } from "@context/InputTypeProvider";
import { fileType, userAccountType, userType } from '@/lib/Types';
import { GeneralContext } from '@/components/context/GeneralContextProvider';
import DashBoardFileEdit from "@/components/blog/dashboard/DashBoardFileEdit";

type mainInputType = {
    file: fileType,
    get_user: userType | null,
    get_account: userAccountType
}

export default function InsertInputContext({ file, get_user, get_account }: mainInputType) {
    const { setUser, setAccount } = React.useContext(GeneralContext);

    React.useEffect(() => {
        if (!get_user) return
        setUser(get_user);
        setAccount(get_account);
    }, [setUser, get_user, get_account, setAccount]);

    return (
        <DashBoardFileEdit recfile={file} />
    )
}

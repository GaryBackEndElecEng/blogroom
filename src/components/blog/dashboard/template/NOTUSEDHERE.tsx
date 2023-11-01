"use client"
import React from 'react'
import InputTypeProvider from '@context/InputTypeProvider';
import DashBoard from '../DashBoard';
import { userAccountType, userType } from '@/lib/Types';
import Login from "@component/comp/Login";

type mainContextType = {
    account: userAccountType | undefined,
    getuser: userType | undefined
}
// USER'S DASHBOARD DISPLAYS ALL OF DASHBOARD!!!!!!!!
export default function InputContextInsert({ account, getuser }: mainContextType) {
    if (account && account.data && getuser) {
        return (
            <InputTypeProvider>
                <DashBoard account={account} getuser={getuser} />
            </InputTypeProvider>
        )
    } else {
        return (
            <div className="grid place-items-center min-h-[50vh]">
                <div className="flex flex-col items-center justify-center p-2">
                    <h3 className="text-3xl font-bold text-white my-2 mx-auto text-center">Login please</h3>
                    <h3 className="text-xl font-bold text-white mb-2 mx-auto text-center">if you do not have an account the please register</h3>
                    <Login />
                </div>
            </div>
        )
    }
}

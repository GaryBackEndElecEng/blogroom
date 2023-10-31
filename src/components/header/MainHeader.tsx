import React from 'react'
import Image from "next/image";
import styles from '@component/header/header.module.css';
import SubHeader from "./SubHeader";
import { getAccount } from "@lib/nextAuth";

export default async function MainHeader() {
    const account = await getAccount();
    return (

        <SubHeader account={account} />

    )
}

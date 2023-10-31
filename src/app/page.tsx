
import Home from "@component/home/Home"
import React from "react";
import { getAccount } from "@lib/nextAuth";




export default async function page() {
  const account = await getAccount();
  return (
    <Home account={account} />
  )
}


import React from 'react';
import { InputContext } from "@context/InputTypeProvider";


export default function Msg() {

    const { msg, setMsg } = React.useContext(InputContext);

    if (msg.msg || msg.loaded) {

        setTimeout(() => {
            setMsg({ loaded: false, msg: "" });

        }, 3000);
    }
    return (
        <div className={`mx-auto flex flex-col items-center  p-2 w-full ${msg.msg ? " absolute top-[50%] inset-x-0 bg-white" : ""}`}>
            {msg.loaded ? (<h4 className="text-blue-900 shadow shadow-white mx-auto py-1 px-2 rounded-lg">{msg.msg}</h4>) : (<h4 className="text-red-800 prose-lg text-2xl shadow shadow-red mx-auto py-1 px-2 rounded-lg">{msg.msg}</h4>)}
        </div>
    )
}

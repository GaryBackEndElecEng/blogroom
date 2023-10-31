import React from 'react';
import type { inputType } from "@lib/Types";

export type mainType = {
    inputs: inputType[]
}
export default function DisplayInputTypes({ inputs }: mainType) {
    const tailWd = "mx-auto flex flex-row items-start justify-evenly flex-wrap gap-2 min-h-[10vh]";
    const section = "mx-auto lg:container w-full lg:w-3/4 mx-auto flex flex-row flex-wrap items-start justify-evenly border border-white shadow rounded-xl gap-2"

    return (
        <section className={section}>
            {
                inputs.map((input, index) => (
                    <div key={index} className={tailWd}>
                        <p className="text-center font-bold">{input.name}</p>
                    </div>
                ))
            }
        </section>
    )
}

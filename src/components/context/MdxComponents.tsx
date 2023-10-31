import type { ComponentPropsWithoutRef, ComponentProps } from "react";
// import type { MDXComponents } from "mdx/types";
// import Image from "next/image";



export const MdxComponents = {

    h1: (props: ComponentPropsWithoutRef<"h1">) => (<h1 className="text-2xl text-blue-600 text-center my-3 font-bold" {...props} />),
    h2: (props: ComponentPropsWithoutRef<"h2">) => (<h2 className="text-left tracking-wide mb-2 font-bold"  {...props} />),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (<h3 className="text-left my-2 underline underline-offset-6" style={{ color: "green" }} {...props} />),
    code: (props: ComponentPropsWithoutRef<"code">) => (<code style={{ color: "white", background: "black" }} className="m-10 shadow-lg rounded-lg" {...props} />),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (<ul style={{ color: "green", background: "black" }} {...props}
        className="border border-white rounded-xl shadow shadow-blue-600 p-5 self-start text-white text-md"
    />),
    li: (props: ComponentPropsWithoutRef<"li">) => (<li style={{ color: "white", }} {...props}
        className=" my-2 list-style-type: disc self-start"
    />),


};
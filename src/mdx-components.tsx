//This file allows you to provide custom React components
//to be used in MDX files. You can import and use any
//React components you want
//REQUIRED FOR /APP=> place./src/mdx-components.tsx name
import type { MDXComponents } from "mdx/types";
import { MdxComponents } from "@component/context/MdxComponents"



interface mdxType {
    components: MDXComponents,
    // children: React.ReactElement
}

export default function useMDXComponents({ components }: mdxType) {
    return {
        // Allows customizing built-in components, e.g. to add styling.
        // This file is REQUIRED to use MDX in `app` directory.
        // h1: ({ children }: mdxType) => <H1>{children}</H1>,


        ...components,
    }
}
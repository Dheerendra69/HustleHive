"use client"

import Link from "next/link";
import {X} from "lucide-react";

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;

        if(form) form.reset();
    }

    return (
            <Link href="/" onClick={reset} className="search-btn text-white">
                <X className="size-5" />
            </Link>
    )
}
export default SearchFormReset

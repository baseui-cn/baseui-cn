"use client";
import Image from "next/image";

import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export const LogoLight = ({ className }: { className?: string }) => {
    return (
        <Image
            src={toAbsoluteUrl("/mark-light.svg")}
            alt="Logo"
            width={20}
            height={20}
            className={cn("w-6 h-6", className)}
        />
    );
};

export const LogoDark = ({ className }: { className?: string }) => {
    return (
        <Image
            src={toAbsoluteUrl("/mark-dark.svg")}
            alt="Logo"
            width={20}
            height={20}
            className={cn("w-6 h-6", className)}
        />
    );
};

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import css from "@/app/page.module.css";
import { PrimaryButton } from "@/components/Button";

export default function Home() {
    const router = useRouter();

    return (
        <div className={css.page}>
            <main className={css.main}>
                <div className={css.logo}>
                    <Image
                        src="images/mariokart-logo.svg"
                        alt="Mariokart Logo"
                        priority={true}
                        fill={true}
                        objectFit="contain"
                        objectPosition="center"
                    />
                </div>
                <div className={css.controls}>
                    <PrimaryButton type="button" onClick={() => router.push("/tournament/player-setup")}>
                        Create tournament
                    </PrimaryButton>
                </div>
            </main>
        </div>
    );
}

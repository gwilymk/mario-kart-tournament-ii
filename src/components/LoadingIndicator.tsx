import { PropsWithChildren } from "react";
import Image from "next/image";

import { useTournament } from "@/components/TournamentContext";
import { imagePrefix } from "@/lib/prefix";

export default function LoadingIndicator({ children }: PropsWithChildren) {
    const { hasLoaded } = useTournament();

    return hasLoaded ? (
        children
    ) : (
        <Image
            src={`${imagePrefix}/images/coin.gif`}
            width={50}
            height={50}
            alt="Loading"
            priority={true}
            unoptimized={true}
        />
    );
}

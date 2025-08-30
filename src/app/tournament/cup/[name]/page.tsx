import { use } from "react";
import { notFound } from "next/navigation";

import { CupSummary } from "@/components/CupSummary";
import { cups, isCup } from "@/lib/cups";

export default function Cup({ params }: Readonly<{ params: Promise<{ name: string }> }>) {
    const { name } = use(params);

    if (!isCup(name)) {
        return notFound();
    }

    return <CupSummary cup={name} />;
}

export async function generateStaticParams() {
    return cups.map((cup) => ({ name: cup }));
}

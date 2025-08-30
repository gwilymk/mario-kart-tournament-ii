import { Cup } from "@/lib/cups";
import { imagePrefix } from "@/lib/prefix";

interface CupIconProps {
    cup: Cup;
}

export default function CupIcon({ cup }: CupIconProps) {
    return <img src={`${imagePrefix}/images/cups/${cup}.webp`} alt={`${cup} cup`} />;
}

import { Cup } from "@/lib/cups";
import { getImageUrl } from "@/lib/prefix";

interface CupIconProps {
    cup: Cup;
}

export default function CupIcon({ cup }: CupIconProps) {
    return <img src={getImageUrl(`/images/cups/${cup}.webp`)} alt={`${cup} cup`} />;
}

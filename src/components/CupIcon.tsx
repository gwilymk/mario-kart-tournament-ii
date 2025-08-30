import { Cup } from "@/lib/cups";

interface CupIconProps {
    cup: Cup;
}

export default function CupIcon({ cup }: CupIconProps) {
    return <img src={`images/cups/${cup}.webp`} alt={`${cup} cup`} />;
}

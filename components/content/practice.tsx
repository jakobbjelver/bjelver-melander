import { cn } from "@/lib/utils";
import { BoxColors, Practice } from "@/types/stimuli";
import { ContentSources } from "@/types/test";

interface PracticeComponentProps {
    contentData: Practice;
}

export function PracticeComponent({ contentData }: PracticeComponentProps) {

    return (
        <div className="grid grid-cols-2 gap-5">
            {contentData.map((box, i) => (
                <div
                    key={i}
                    className={
                        cn(
                            "h-[200px] w-[200px]",
                            box.color === BoxColors.BLUE && 'bg-blue-500',
                            box.color === BoxColors.ORANGE && 'bg-orange-500',
                            box.color === BoxColors.RED && 'bg-red-500',
                            box.color === BoxColors.GREEN && 'bg-green-500',
                            box.opacity === 1 ? 'brightness-50' : box.opacity === 2 ? 'brightness-75' : box.opacity === 3 ? 'brightness-100' : 'brightness-200'
                        )
                    }>

                </div>
            ))}
        </div>
    )
}
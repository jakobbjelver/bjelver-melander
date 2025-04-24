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
                            "h-[170px] w-[170px]",
                            box.color === BoxColors.BLUE && 'bg-blue-500',
                            box.color === BoxColors.ORANGE && 'bg-orange-500',
                            box.color === BoxColors.RED && 'bg-red-500',
                            box.color === BoxColors.GREEN && 'bg-green-500',
                        )
                    }>

                </div>
            ))}
        </div>
    )
}
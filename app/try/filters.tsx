"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { ContentLengths, ContentSources, TestSlugs } from "@/types/test"



export function Filters() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    // read existing query params
    const currentSource = params.get("source") ?? ContentSources.Original
    const currentLength = params.get("length") ?? ContentLengths.Shorter

    function updateQuery(updates: Record<string, string>) {
        const next = new URLSearchParams(params.toString())

        // apply each update (remove if empty)
        Object.entries(updates).forEach(([key, value]) => {
            if (value) next.set(key, value)
            else next.delete(key)
        })

        // replace so back‑button works more naturally
        router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    }

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-4xl mx-auto">
            <Select
                value={params.get("test") ?? TestSlugs.EMAIL_INBOX}
                onValueChange={(test) => updateQuery({ test })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(TestSlugs).map((t) => (
                        <SelectItem key={t} value={t}>
                            {t.toUpperCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <ToggleGroup
                type="single"
                value={currentSource}
                onValueChange={(source) => updateQuery({ source })}
            >
                {Object.values(ContentSources).map((s) => (
                    <ToggleGroupItem key={s} value={s}>
                        {s.toUpperCase()}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

             
                <ToggleGroup
                    type="single"
                    value={currentLength}
                    onValueChange={(length) => updateQuery({ length })}
                >
                    {Object.values(ContentLengths).map((l) => (
                        <ToggleGroupItem key={l} value={l}>
                            {l.toUpperCase()}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            
        </div>
    )
}
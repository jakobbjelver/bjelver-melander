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

enum TestSlug {
    PUSH_NOTIFICATIONS = 'push-notifications',
    SEARCH_ENGINE = 'search-engine',
    EMAIL_INBOX = 'email-inbox',
    PRODUCT_LISTING = 'product-listing',
    MEETING_TRANSCRIPTION = 'meeting-transcription',
    PRESENTATION_SLIDE = 'presentation-slide',
}
enum contentSources {
    AI = 'ai',
    Original = 'original',
    Programmatic = 'programmatic'
}

enum contentLengths {
    Longer = 'longer',
    Shorter = 'shorter',
}

export function Filters() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    // read existing query params
    const currentSource = params.get("source") ?? contentSources.Original
    const currentLength = params.get("length") ?? contentLengths.Shorter

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
                value={params.get("test") ?? undefined}
                onValueChange={(test) => updateQuery({ test })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(TestSlug).map((t) => (
                        <SelectItem key={t} value={t}>
                            {t}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <ToggleGroup
                type="single"
                value={currentSource}
                onValueChange={(source) => updateQuery({ source })}
            >
                {Object.values(contentSources).map((s) => (
                    <ToggleGroupItem key={s} value={s}>
                        {s}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            {currentSource === contentSources.Original && (
                <ToggleGroup
                    type="single"
                    value={currentLength}
                    onValueChange={(length) => updateQuery({ length })}
                >
                    {Object.values(contentLengths).map((l) => (
                        <ToggleGroupItem key={l} value={l}>
                            {l}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            )}
        </div>
    )
}
import 'server-only' // Add this at the very top

// app/participant/[participantId]/test/[testSlug]/page.tsx
import { TestContentDisplay } from '@/components/test-content-display'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTestContent } from '@/lib/data/tests'
import { Filters } from './filters'
import { ContentLengths, ContentSources, TestSlugs } from '@/types/test'

interface PageProps {
    searchParams: Promise<{
        source: ContentSources
        length: ContentLengths
        test: TestSlugs
    }>;
}

export default async function Page({ searchParams }: PageProps) {
    // dynamic route value
    const { source: initSource, length: initLength, test: initTest } = await searchParams

    const source = initSource || ContentSources.Original
    const length = initLength || ContentLengths.Longer
    const test = initTest || TestSlugs.EMAIL_INBOX

    const content = getTestContent(test, source, length)

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col items-center pb-12">
            <Filters />
            {content && <TestContentDisplay
                source={source}
                testSlug={test}
                contentData={content}
            />}
            <Button asChild className="max-w-sm w-full md:max-w-sm" size="lg">
                <Link href="">Done</Link>
            </Button>
        </div>
    )
}
import 'server-only' // Add this at the very top

// app/participant/[participantId]/test/[testSlug]/page.tsx
import { TestContentDisplay } from '@/components/test-content-display'
import { getTestContent, getTestQuestions } from '@/lib/data/tests'
import { Filters } from './filters'
import { ContentLengths, ContentSources, TestSlugs } from '@/types/test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestQuestionForm } from '@/components/forms/test-question-form'
import { formatString } from '@/lib/utils'

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
    const questions = getTestQuestions(test)

    const renderDescription = (activeTab: string) => {
        return <p className='py-4 text-center w-full'>Showing {formatString(length).toLowerCase()} {source == ContentSources.AI ? 'AI' : formatString(source).toLowerCase()} {activeTab} for {formatString(test).toLowerCase()}.</p>
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col items-center pb-12">
            <Filters />
            <Tabs defaultValue="content" className="w-full grid">
                <TabsList className='w-[200px] place-self-center h-10'>
                    <TabsTrigger value="content" className='w-full h-8'>Content</TabsTrigger>
                    <TabsTrigger value="questions" className='w-full h-8'>Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                    {renderDescription("content")}
                    {content && <TestContentDisplay
                        source={source}
                        testSlug={test}
                        contentData={content}
                    />}
                </TabsContent>
                <TabsContent value="questions">
                    {renderDescription("questions")}
                    <TestQuestionForm
                        questions={questions}
                        participantId={null}
                        testSlug={test}
                        action={null}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
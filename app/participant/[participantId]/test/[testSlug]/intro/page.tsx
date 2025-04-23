// app/participant/[participantId]/test/[testSlug]/page.tsx
import { Button } from '@/components/ui/button';
import { TestSlugs } from '@/types/test';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react';

interface ContentPageProps {
    params: Promise<{
        participantId: string;
        testSlug: TestSlugs;
    }>;
}

const contentLabel: { [key in TestSlugs]?: string } = {
    [TestSlugs.PUSH_NOTIFICATIONS]: 'Push Notifications',
    [TestSlugs.EMAIL_INBOX]: 'an Email Inbox',
    [TestSlugs.MEETING_TRANSCRIPTION]: 'a Meeting Transcription',
    [TestSlugs.PRODUCT_LISTING]: 'a Product Listing',
    [TestSlugs.SEARCH_ENGINE]: 'a Search Engine',
    [TestSlugs.PRESENTATION_SLIDE]: 'a Slide Presentation',
    [TestSlugs.PRACTICE]: 'Colorful Boxes',
};

export default async function IntroPage({ params }: ContentPageProps) {
    const { participantId, testSlug } = await params;

    const nextPath = `/participant/${participantId}/test/${testSlug}/content`

    const isFirstRound = testSlug === TestSlugs.PRACTICE
    const isFirstRealRound = testSlug === TestSlugs.PUSH_NOTIFICATIONS

    return (
        <div className="w-full mx-auto flex flex-col items-center max-w-md space-y-4">
            <h3 className='text-2xl font-bold'>Intro</h3>
            {isFirstRound && (
                <>
                    <p>The experiment consists of 6 rounds, starting with a test round. Each round starts with an intro screen (like this), followed by the content, and ends with questions about the content.</p>
                    <p>This round will be a <strong>test round</strong>. It is over-simplified in order to demonstrate the process.</p>
                    <br></br>

                    <p className='text-left w-full text-lg font-semibold'>The Content</p>
                    <p className='text-left w-full italic'>This is the content you will interact with</p>
                    <ul className='list-decimal'>
                        {Object.values(contentLabel).map((label, key) => (
                            label !== 'Colorful Boxes' && <li key={key}>{label}</li>
                        ))}
                    </ul>
                    <br></br>

                    <p className='text-left w-full text-lg font-semibold'>The Process</p>
                    <p className='text-left w-full italic'>This is how each round works</p>
                    <ul className='list-decimal space-y-3'>
                        <li>Start at the intro page (this page) and <strong>read instructions</strong>.</li>
                        <li>Observe and <strong>interact with the content</strong> (Push Notifications, an Email Inbox, etc.)</li>
                        <li><strong>Answer questions</strong> about the content.</li>
                    </ul>
                    {isFirstRound && <Alert variant={'destructive'}>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            You are under no circumstances allowed to "go back", that is to navigate backwards in your web history. Once you have proceeded from the content to the questions, you should not go back again.
                        </AlertDescription>
                    </Alert>}
                    <br></br>

                    <p className='text-left w-full text-lg font-semibold'>Instructions</p>
                </>
            )}
            <p>Please observe and interact with each item carefully, but without overthinking it, before making your decision. Next, you will see <strong>{contentLabel[testSlug]}</strong>.</p>
            {!isFirstRound && <p>This is <strong>not</strong> a test round.</p>}
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                    There is no time limit, but please move at a steady pace.
                </AlertDescription>
            </Alert>
            <Button asChild className='max-w-sm w-full md:max-w-sm' size={'lg'}>
                <Link href={nextPath}>Next</Link>
            </Button>
        </div>
    );
}
// app/participant/[participantId]/test/[testSlug]/page.tsx
import { TestContentDisplay } from '@/components/test-content-display';
import { Button } from '@/components/ui/button';
import { getParticipantAction } from '@/lib/actions/participantActions';
import { getTestContent, TestSlug } from '@/lib/data/tests';
import Link from 'next/link';

interface TestPageProps {
  params: Promise<{
    participantId: string;
    testSlug: TestSlug;
  }>;
}

export default async function ContentPage({ params }: TestPageProps) {
  const { participantId, testSlug } = await params;

  const nextPath = `/participant/${participantId}/test/${testSlug}/questions`

  // --- Server-Side Data Fetching ---
  // 1. Get participant's assigned group
  const participant = await getParticipantAction(participantId);
  if (!participant) {
    // Handle error: Participant not found or group not assigned
    return <p>Error: Could not find participant data.</p>;
  }

  // 2. Get the specific test content based on slug and group
  const content = getTestContent(testSlug, participant.assignedSourceOrder, participant.assignedLength);
  if (!content) {
    // Handle error: Content for this test/group combination not found
    return <p>Error: Could not load test content.</p>;
  }


  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col items-center">
      <TestContentDisplay testSlug={testSlug} contentData={content} />
      <Button asChild className='max-w-sm w-full md:max-w-sm' size={'lg'}>
        <Link href={nextPath}>Done</Link>
      </Button>
    </div>
  );
}
// app/participant/[participantId]/test/[testSlug]/page.tsx
import { TestContentDisplay } from '@/components/test-content-display';
import { Button } from '@/components/ui/button';
import { getParticipantAction } from '@/lib/actions/participantActions';
import { getMaskFromLength, getMaskFromSource } from '@/lib/data/participants';
import { getAssignedSource, getTestContent } from '@/lib/data/tests';
import { TestSlugs } from '@/types/test';
import Link from 'next/link';

interface ContentPageProps {
  params: Promise<{
    participantId: string;
    testSlug: TestSlugs;
  }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { participantId, testSlug } = await params;

  // --- Server-Side Data Fetching ---
  // 1. Get participant's assigned group
  const participant = await getParticipantAction(participantId);
  if (!participant) {
    // Handle error: Participant not found or group not assigned
    throw new Error (`Participant not found: ${participantId}`)
  }

  const source = getAssignedSource(testSlug, participant.assignedSourceOrder)
  if (!source) {
    // Handle error: Participant not found or group not assigned
    throw new Error (`Could not determine source: test: ${testSlug}, source order: ${participant.assignedSourceOrder}`)
  }

  // 2. Get the specific test content based on slug and group
  const content = getTestContent(testSlug, source, participant.assignedLength);
  if (!content) {
    // Handle error: Content for this test/group combination not found
    throw new Error (`Content for this test/group combination not found: test: ${testSlug}, source: ${source}, length: ${participant.assignedLength}`)
  }

  console.log("Source: ", source)
  console.log("Length: ", participant.assignedLength)
  console.log("Test: ", testSlug)

  const startTime = Date.now()

  const maskedSource = getMaskFromSource(source)
  const maskedLength = getMaskFromLength(participant.assignedLength)

  const nextPath = `/participant/${participantId}/test/${testSlug}/questions?source=${maskedSource}&length=${maskedLength}&time=${startTime}`


  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col items-center">
      <TestContentDisplay source={source} testSlug={testSlug} contentData={content} />
      <Button asChild className='max-w-sm w-full md:max-w-sm' size={'lg'}>
        <Link href={nextPath}>Done</Link>
      </Button>
    </div>
  );
}
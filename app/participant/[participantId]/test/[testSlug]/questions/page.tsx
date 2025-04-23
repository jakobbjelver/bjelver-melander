// app/participant/[participantId]/test/[testSlug]/page.tsx
import { TestQuestionForm } from '@/components/forms/test-question-form';
import { saveTestResponses } from '@/lib/actions/responseActions';
import { getLengthFromMask, getSourceFromMask } from '@/lib/data/participants';
import { getTestQuestions, TestSlug } from '@/lib/data/tests';
import { contentSources } from '@/lib/db/schema';
import { redirect } from 'next/navigation'

interface TestPageProps {
  params: Promise<{
    participantId: string;
    testSlug: TestSlug;
  }>;
  searchParams: Promise<{
    source: number;
    length: number;
  }>;
}

export default async function QuestionsPage({ params, searchParams }: TestPageProps) {
  const { participantId, testSlug } = await params; 
  const { source, length } = await searchParams;

  const contentSource = getSourceFromMask(source)
  const contentLength = getLengthFromMask(length)

  if(!contentSource || !contentLength || !participantId || !testSlug) {
    throw new Error(`Invalid data provided: length: ${contentLength}, source: ${contentSource}, participant: ${participantId}, test: ${testSlug}`)
  }

  // 3. Get the questions associated with this test slug
  const questions = await getTestQuestions(testSlug);

  const startTime = new Date().getTime()

  // **Use .bind() to pre-fill the startTime argument**
  // The 'null' argument for bind refers to 'this' context, which is not relevant here.
  const saveActionWithStartTime = saveTestResponses.bind(null, startTime, contentSource, contentLength);

  return (
    <div className="w-full max-w-4xl mx-auto">

      <h2 className="text-xl font-semibold mb-4">Please answer the following questions:</h2>
      <TestQuestionForm
        questions={questions}
        participantId={participantId}
        testSlug={testSlug}
        action={saveActionWithStartTime}
      />
    </div>
  );
}
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
    source: number;
    length: number;
  }>;
}

export default async function QuestionsPage({ params }: TestPageProps) {
  const { participantId, testSlug, source, length } = await params;

  const contentSource = getSourceFromMask(source)
  const contentLength = getLengthFromMask(length)

  if(!contentSource || !contentLength) {
    return <h1>Content source or length not provided.</h1>
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
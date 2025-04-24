import { TestQuestionForm } from '@/components/forms/test-question-form'
import { saveTestResponses } from '@/lib/actions/responseActions'
import { getLengthFromMask, getSourceFromMask } from '@/lib/data/participants'
import { getTestQuestions } from '@/lib/data/tests'
import { TestSlugs } from '@/types/test'

interface TestPageProps {
  params: Promise<{ participantId: string; testSlug: TestSlugs }>
  searchParams: Promise<{ source: string; length: string, time: string }>
}

export default async function QuestionsPage({ params, searchParams }: TestPageProps) {
  const { participantId, testSlug } = await params

  const search = await searchParams

  const startTime = parseInt(search.time, 10)

  // parse the incoming masks
  const sourceMask = parseInt(search.source, 10)
  const lengthMask = parseInt(search.length, 10)

  console.log("Source mask: ", sourceMask)
  console.log("Length mask: ", lengthMask)

  const contentSource = getSourceFromMask(sourceMask)
  const contentLength = getLengthFromMask(lengthMask)

  console.log("Source: ", contentSource)
  console.log("Length: ", contentLength)

  if (!contentSource || !contentLength) {
    throw new Error(
      `Invalid data: sourceMask=${sourceMask}, lengthMask=${lengthMask}, participant=${participantId}, test=${testSlug}`
    )
  }

  const questions = await getTestQuestions(testSlug)
  const saveActionWithStartTime = saveTestResponses.bind(null, startTime, contentSource, contentLength)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Please answer the following questions:
      </h2>
      <TestQuestionForm
        questions={questions}
        participantId={participantId}
        testSlug={testSlug}
        action={saveActionWithStartTime}
      />
    </div>
  )
}
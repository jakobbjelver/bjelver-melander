// app/participant/[participantId]/post-questionnaire/page.tsx
import { QuestionnaireForm } from '@/components/forms/questionnaire-form';
import { saveQuestionnaireResponses } from '@/lib/actions/responseActions';
import { getPostQuestionnaireQuestions, Question } from '@/lib/data/questionnaire';

interface PostQuestionnairePageProps {
  params: Promise<{
    participantId: string;
  }>;
}


export default async function PostQuestionnairePage({ params }: PostQuestionnairePageProps) {
  const { participantId } = await params;
  const questions = getPostQuestionnaireQuestions(); // Fetch post-questions

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-5">
      <h1 className="text-2xl font-bold">Post-Experiment Questionnaire</h1>
      <p>Please answer the following questions reflecting on the tasks you just completed.</p>

      {/* Reuse the same form component */}
      <QuestionnaireForm
        questions={questions}
        participantId={participantId}
        questionnaireType="post"
        // Use the same action, it determines the next step based on type
        action={saveQuestionnaireResponses}
      />

    </div>
  );
}
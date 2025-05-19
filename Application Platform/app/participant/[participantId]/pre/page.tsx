// app/participant/[participantId]/pre/page.tsx

import { QuestionnaireForm } from "@/components/forms/questionnaire-form";
import { saveQuestionnaireResponses } from "@/lib/actions/responseActions";
import { getPreQuestionnaireQuestions } from "@/lib/data/questionnaire";

interface PreQuestionnairePageProps {
  params: Promise<{
    participantId: string;
  }>;
}

export default async function PreQuestionnairePage({ params }: PreQuestionnairePageProps) {
  const { participantId } = await params;
  // TODO: Fetch actual questions for the pre-questionnaire
  const questions = getPreQuestionnaireQuestions();

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-5">
      <h1 className="text-2xl font-bold">Pre-Experiment Questionnaire</h1>
      <p>Please answer the following questions based on your current views.</p>

      <QuestionnaireForm
        questions={questions}
        participantId={participantId}
        questionnaireType="pre"
        // Bind the server action with participantId and type
        action={saveQuestionnaireResponses}
      />
    </div>
  );
}

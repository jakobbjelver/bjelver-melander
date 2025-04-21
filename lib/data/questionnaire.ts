
// lib/data/questions.ts
export interface Question {
  id: string; // e.g., 'trust_q1'
  text: string;
  type: 'likert7' | 'text' | 'number' | 'multipleChoice'; // Added multipleChoice
  options?: string[]; // Added options for multipleChoice
  multipleCorrectAnswers?: boolean; // Optional: Allow multiple correct answers
}

export function getPreQuestionnaireQuestions(): Question[] {
  // TODO: Replace with actual questions, potentially fetched from DB or CMS
  return [
    { id: 'pre_q1', text: 'How familiar are you with AI-generated content?', type: 'likert7' },
    { id: 'pre_q2', text: 'To what extent do you trust information presented online?', type: 'likert7' },
    // ... more questions
  ];
}

export function getPostQuestionnaireQuestions(): Question[] {
  // TODO: Replace with actual post-experiment questions
  return [
    { id: 'post_q1', text: 'How engaging did you find the tasks overall?', type: 'likert7' },
    { id: 'post_q2', text: 'How mentally demanding were the tasks?', type: 'likert7' },
    { id: 'post_q3', text: 'Do you have any feedback on the experiment?', type: 'text' }, // Example text question
    // ... more questions
  ];
}
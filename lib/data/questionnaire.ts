
// lib/data/questions.ts
export interface Question {
  id: string; // e.g., 'trust_q1'
  text: string;
  type: 'likert7' | 'text' | 'number' | 'multipleChoice'; // Added multipleChoice
  options?: string[]; // Added options for multipleChoice
  multipleCorrectAnswers?: boolean; // Optional: Allow multiple correct answers
}

export function getPreQuestionnaireQuestions(): Question[] {
  return [
    {
      id: 'pre_gender',
      text: 'What is your gender?',
      type: 'multipleChoice',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'],
    },
    {
      id: 'pre_education',
      text: 'What is the highest level of education you have completed or are currently pursuing?',
      type: 'multipleChoice',
      options: ['High School', "Bachelor’s Degree", "Master’s Degree", 'PhD', 'Other'],
    },
    {
      id: 'pre_content_familiarity',
      text: 'How familiar are you with using electronic devices, such as smartphones and laptops?',
      type: 'likert7',
      options: ['Not at all familiar', '', '', '', '', '', 'Very familiar'],
    },
    {
      id: 'pre_decision_experience',
      text: 'How often do you make decisions based on the information shown on those devices?',
      type: 'likert7',
      options: ['Never', '', '', 'Sometimes', '', '', 'Very often'],
    },
    {
      id: 'pre_ai_familiarity',
      text: 'How familiar are you with AI content-generation tools (e.g., ChatGPT)?',
      type: 'likert7',
      options: ['Not at all familiar', '', '', '', '', '', 'Very familiar'],
    },
    {
      id: 'pre_ai_usage',
      text: 'How often do you use AI tools for tasks like summarizing or writing?',
      type: 'likert7',
      options: ['Never', '', '', 'Sometimes', '', '', 'Very often'],
    },
    {
      id: 'pre_tech_comfort',
      text: 'How comfortable are you using online platforms and tools?',
      type: 'likert7',
      options: ['Very uncomfortable', '', '', '', '', '', 'Very comfortable'],
    },
  ];
}

export function getPostQuestionnaireQuestions(): Question[] {
  return [
    {
      id: 'post_overall_difficulty',
      text: 'Overall, how difficult did you find the decision-making tasks?',
      type: 'likert7',
      options: ['Very easy', '', '', '', '', '', 'Very difficult'],
    },
    {
      id: 'post_confidence',
      text: 'How confident are you in the decisions you made?',
      type: 'likert7',
      options: ['Not at all confident', '', '', '', '', '', 'Very confident'],
    },
    {
      id: 'post_effort',
      text: 'How much mental effort did the tasks require?',
      type: 'likert7',
      options: ['Very low effort', '', '', '', '', '', 'Very high effort'],
    },
    {
      id: 'post_engagement',
      text: 'How engaging did you find the experiment?',
      type: 'likert7',
      options: ['Not at all engaging', '', '', '', '', '', 'Very engaging'],
    },
    {
      id: 'post_general_feedback',
      text: 'Do you have any other comments or feedback about the experiment?',
      type: 'text',
    },
  ];
}
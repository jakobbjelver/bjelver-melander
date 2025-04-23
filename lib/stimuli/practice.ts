import { BoxColors, PracticeItem } from "@/types/stimuli";
import { Question } from "../data/questionnaire";

export const practiceData: PracticeItem[] = [
    { color: BoxColors.BLUE, opacity: 1 },
    { color: BoxColors.ORANGE, opacity: 4 },
    { color: BoxColors.GREEN, opacity: 3 },
    { color: BoxColors.RED, opacity: 2 }
]

export const practiceTests: Question[] = [
    {
        id: "practice_accuracy",
        text: 'Based on the squares you just saw, which one had the highest opacity (most "colorful")?',
        type: 'multipleChoice',
        options: [
            "Red square",
            "Blue square",
            "Orange square",
            "Green square",
        ],
        multipleCorrectAnswers: false,
        // correctAnswerIndex: 3  // Postpone to Q4 was the consensus decision mentioned multiple times in relevant sections (IDs 3, 4, 5, 10).
    },
    {
        id: "practice_comprehension",
        text: "Which box colors did you see?",
        type: 'multipleChoice',
        options: [
            "Blue", // Accurate (IDs 4, 5, 10)
            "Green", // Accurate (IDs 3, 4, 10)
            "Orange", // Accurate (IDs 3, 4, 10)
            "Red", // Accurate (IDs 3, 4, 10)
            "Yellow", // Accurate (IDs 3, 4, 10)
            "Pink", // Accurate (IDs 3, 4, 10)
            "Brown", // Accurate (IDs 3, 4, 10)
        ],
        multipleCorrectAnswers: true,
        // correctAnswerIndices: [0, 1, 2, 3, 4]
    }
];
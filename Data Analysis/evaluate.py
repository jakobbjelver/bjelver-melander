# evaluate.py

import pandas as pd
import json

def evaluate_data():
    # Define the correct answers
    answers = {
        "email-inbox_accuracy": "Review and give feedback on the legal team's contract",
        "email-inbox_comprehension": [
            "You have a mandatory training session to attend tomorrow",
            "Sarah Johnson has requested an extension for a project deadline",
            "You need to provide feedback on a contract by the end of today"
        ],
        "meeting-transcription_accuracy": "Refine and improve existing core user experiences and address known technical problems.",
        "meeting-transcription_comprehension": [
            "Reviewing current product features.",
            "Evaluating the project timeline.",
            "Addressing technical performance."
        ],
        "presentation-slide_accuracy": "Enhance core technology offerings",
        "presentation-slide_comprehension": [
            "Projected revenue growth",
            "Targets for operating margin"
        ],
        "product-listing_accuracy": "All items are discounted",
        "product-listing_comprehension": [
            "All the audio items listed are available to buy right now.",
            "The audio products represent offerings from multiple different brands.",
            "Information about customer satisfaction (ratings) is provided for all audio items."
        ],
        "push-notifications_accuracy": "Information related to weather alerts.",
        "push-notifications_comprehension": [
            "You have an upcoming meeting with a team member named Sarah",
            "There is a severe weather alert active in your area"
        ],
        "search-engine_accuracy": "Written articles",
        "search-engine_comprehension": [
            "Varied content formats",
            "Different update schedules"
        ]
    }

    def evaluate_response(row, answers):
        question_type = row['question']
        response_value = row['response_value']

        if question_type == "accuracy":
            test_slug = row['test_slug']
            # For accuracy, exact match is required
            correct_answer = answers.get(f"{test_slug}_{question_type}")
            return 1 if response_value == correct_answer else 0
        elif question_type == "comprehension":
            test_slug = row['test_slug']
            # For comprehension, compare lists and return a similarity score
            correct_answers = answers.get(f"{test_slug}_{question_type}", [])

            # Ensure response_value is treated as a list for comparison
            if not isinstance(response_value, list):
                # Attempt to parse the string representation of a list
                try:
                    response_list = json.loads(response_value)
                    if not isinstance(response_list, list):
                        response_list = [response_value] if response_value is not None else []
                except json.JSONDecodeError:
                    response_list = [response_value] if response_value is not None else []
            else:
                response_list = response_value

            # Calculate similarity: number of correct items in the response
            # divided by the total number of unique correct answers.
            # Using sets to handle potential duplicates and order
            correct_set = set(correct_answers)
            response_set = set(response_list)

            if not correct_set: # Avoid division by zero if there are no correct answers
                return 1.0 if not response_set else 0.0 # If no correct answers, full score only if response is also empty list

            # Number of elements common to both sets
            common_elements = len(correct_set.intersection(response_set))

            # Similarity score: proportion of correct elements found in the response
            similarity_score = common_elements / len(correct_set)

            return round(similarity_score, 2)
        else:
            # For other question types, returns the response value as a decimal (7 point Likert scale)
            # Invert the scale so 7 (highest value) becomes 1, and 1 becomes 0
            try:
                normalized_value = (int(response_value) - 1) / 6
                return round(1 - normalized_value, 2)
            except (ValueError, TypeError):
                return 0.0 # Return 0 if response_value cannot be converted to int


    # Read the CSV files
    test_data = pd.read_csv("data/test_data_wrangled.csv")
    questionnaire_data = pd.read_csv("data/questionnaire_data_wrangled.csv")

    # Apply the evaluation function to create the is_correct column
    test_data['response_value'] = test_data.apply(lambda row: evaluate_response(row, answers), axis=1)
    questionnaire_data['response_value'] = questionnaire_data.apply(lambda row: evaluate_response(row, answers), axis=1)

    # Save the dataframes to CSV files
    test_data.to_csv("data/test_data_evaluated.csv", index=False)
    questionnaire_data.to_csv("data/questionnaire_data_evaluated.csv", index=False)

    print("Evaluation complete. Output saved.")

# This block allows the script to be run directly
if __name__ == "__main__":
    evaluate_data()
# wrangle.py

import pandas as pd

def wrangle_data():
    df_test_responses = pd.read_csv("data/init/test_responses.csv")
    df_participants = pd.read_csv("data/init/participants.csv")
    df_questionnaire_responses = pd.read_csv("data/init/questionnaire_responses.csv")

    # Filter df_participants to keep only rows where is_controlled is True
    df_participants_filtered = df_participants[df_participants['is_controlled'] == True].copy()

    # Convert `created_at` column to datetime in '%Y-%m-%d' format
    df_participants_filtered['date'] = pd.to_datetime(df_participants_filtered['created_at']).dt.strftime('%Y-%m-%d')

    # Convert `timestamp` column to datetime in '%Y-%m-%d' format
    df_test_responses['date'] = pd.to_datetime(df_test_responses['timestamp']).dt.strftime('%Y-%m-%d')
    df_questionnaire_responses['date'] = pd.to_datetime(df_questionnaire_responses['timestamp']).dt.strftime('%Y-%m-%d')

    # Filter the participants for Thursday (2025-04-24) and Friday (2025-04-25)
    df_participants_valid = df_participants_filtered[df_participants_filtered['date'] >= '2025-04-25'].copy()

    # Rename the `id` column to `participant_id` in both dataframes before merging
    df_participants_valid = df_participants_valid.rename(columns={'id': 'participant_id'})

    # Aggregate df_test_responses, INCLUDING content_length and content_source
    # We'll take the first value for content_length and content_source within each group
    aggregated_test_responses = df_test_responses.groupby(['test_slug', 'question_id', 'participant_id']).agg(
        id=('id', lambda x: '-'.join(x.astype(str))),
        response_value=('response_value', lambda x: list(x) if len(x) > 1 else x.iloc[0]),
        length=('content_length', 'first'), # Include content_length
        source=('content_source', 'first'),   # Include content_source
        reaction_time=('reaction_time_ms', 'first'),
    ).reset_index()

    aggregated_questionnaire_responses = df_questionnaire_responses.groupby(['questionnaire_type', 'question_id', 'participant_id']).agg(
        id=('id', lambda x: '-'.join(x.astype(str))),
        response_value=('response_value', lambda x: int(x)),
    ).reset_index()

    # Create a new column with just the dependent variable
    aggregated_test_responses['question'] = aggregated_test_responses['question_id'].str.rsplit('_', 1).str[-1]
    aggregated_questionnaire_responses['question'] = aggregated_questionnaire_responses['question_id'].str.split('_', 1).str[1]

    # Merge the aggregated data with the participant data for Thursday and Friday
    # Using the aggregated_responses which has unique participant_id
    test_data = aggregated_test_responses.merge(df_participants_valid, on='participant_id', how='inner')
    questionnaire_data = aggregated_questionnaire_responses.merge(df_participants_valid, on='participant_id', how='inner')

    # Filter out rows where test_slug is "practice"
    test_data = test_data[test_data['test_slug'] != "practice"].copy()

    # Drop unnecessary columns
    test_columns_to_drop = ['question_id', 'created_at', 'date', 'is_pilot', 'is_controlled', 'assigned_source_order', 'assigned_length']
    test_data = test_data.drop(columns=test_columns_to_drop, errors='ignore')

    questionnaire_columns_to_drop = ['question_id',  'created_at', 'date', 'is_pilot', 'is_controlled', 'is_mobile', 'age', 'assigned_source_order', 'assigned_length']
    questionnaire_data = questionnaire_data.drop(columns=questionnaire_columns_to_drop, errors='ignore')

    # Save the dataframes to CSV files
    test_data.to_csv("data/test_data_wrangled.csv", index=False)
    questionnaire_data.to_csv("data/questionnaire_data_wrangled.csv", index=False)

# This block allows the script to be run directly
if __name__ == "__main__":
    wrangle_data()
# data_handling.py
import pandas as pd
import numpy as np # often useful for handling NaNs

def load_and_inspect_data(experiment_file='data/test_data_evaluated.csv',
                          questionnaire_file='data/questionnaire_data_evaluated.csv'):
    """Loads the experiment and questionnaire datasets and performs initial inspection."""
    print(f"\nLoading experiment data from: {experiment_file}")
    try:
        df_experiment = pd.read_csv(experiment_file)
    except FileNotFoundError:
        print(f"Error: Experiment data file not found at {experiment_file}")
        return None, None

    print("\nExperiment Data (first 5 rows):")
    # Check if dataframe is not empty before printing head
    if not df_experiment.empty:
        print(df_experiment.head().to_markdown(index=False, numalign="left", stralign="left"))
    else:
        print("Experiment dataframe is empty.")


    print("\nExperiment data info:")
    # Check if dataframe is not empty before printing info
    if not df_experiment.empty:
        df_experiment.info()
    else:
        print("Experiment dataframe is empty.")

    print(f"\nLoading questionnaire data from: {questionnaire_file}")
    try:
        df_questionnaire = pd.read_csv(questionnaire_file)
    except FileNotFoundError:
        print(f"Error: Questionnaire data file not found at {questionnaire_file}")
        # Return the experiment data even if questionnaire data is missing
        return df_experiment, None

    print("\nQuestionnaire Data (first 5 rows):")
    # Check if dataframe is not empty before printing head
    if not df_questionnaire.empty:
        print(df_questionnaire.head().to_markdown(index=False, numalign="left", stralign="left"))
    else:
         print("Questionnaire dataframe is empty.")

    print("\nQuestionnaire data info:")
    # Check if dataframe is not empty before printing info
    if not df_questionnaire.empty:
        df_questionnaire.info()
    else:
        print("Questionnaire dataframe is empty.")


    return df_experiment, df_questionnaire

def check_data_completeness(df):
    """Identifies participants with incomplete 'source' data for ANOVA dependent variables (within experiment data)."""
    if df is None or df.empty:
        print("\n--- Skipping data completeness check: Experiment data is empty or None ---")
        return {}

    dependent_vars_anova = ['confidence', 'comprehension', 'satisfaction', 'effort']
    participants_to_exclude_per_dv = {}

    print("\n--- Checking for Participants with Incomplete 'source' Data per DV (Experiment Data) ---")
    for dv in dependent_vars_anova:
        print(f"\nChecking data for {dv}...")
        # Filter for the specific dependent variable and ensure required columns exist
        df_dv_check = df[(df['question'] == dv) & df['source'].notna() & df['participant_id'].notna()].copy()

        if df_dv_check.empty:
             print(f"No relevant data found for {dv} to check source completeness.")
             participants_to_exclude_per_dv[dv] = []
             continue

        # Check for number of unique sources per participant for this DV
        source_counts = df_dv_check.groupby('participant_id')['source'].nunique()

        # Get the total number of expected sources (all participants should have all sources)
        expected_sources = df_dv_check['source'].nunique()
        if expected_sources == 0: # Avoid division by zero if no sources found
            print(f"No 'source' values found for {dv}. Cannot check completeness.")
            participants_to_exclude_per_dv[dv] = []
            continue

        incomplete_participants = source_counts[source_counts < expected_sources].index.tolist()

        if incomplete_participants:
            print(f"Found {len(incomplete_participants)} participant(s) with incomplete 'source' data for {dv}:")
            print(incomplete_participants)
            participants_to_exclude_per_dv[dv] = incomplete_participants
        else:
            print(f"All participants have complete 'source' data for {dv}.")
            participants_to_exclude_per_dv[dv] = []

    return participants_to_exclude_per_dv

def create_new_dvs(df):
    """
    Adds aggregate quality scores (general, subjective, objective) and
    reaction time as new 'questions' for each participant/test group.

    Args:
        df: pandas DataFrame with columns test_slug, participant_id, id,
            response_value, length, source, reaction_time, question.

    Returns:
        pandas DataFrame with original rows plus new aggregate rows.
    """
    # Define the question sets for the new quality metrics
    general_questions = ['confidence', 'comprehension', 'satisfaction', 'effort', 'accuracy']
    subjective_questions = ['confidence', 'satisfaction', 'effort']
    objective_questions = ['accuracy', 'comprehension']

    # Group by test_slug and participant_id
    grouped = df.groupby(['test_slug', 'participant_id'])

    # List to store the new rows
    new_rows_list = []

    # Iterate over each group (test_slug, participant_id)
    for (test_slug, participant_id), group_df in grouped:
        # Calculate means for each quality type
        general_mean = group_df[group_df['question'].isin(general_questions)]['response_value'].mean()
        subjective_mean = group_df[group_df['question'].isin(subjective_questions)]['response_value'].mean()
        objective_mean = group_df[group_df['question'].isin(objective_questions)]['response_value'].mean()

        # Get values for other columns - assuming they are consistent within the group
        # Source and reaction_time is consistent within participant/test
        # id and length are specific to the original question and will be None/NaN for new rows
        # Use .iloc[0] to get the first value in the group, assuming consistency
        source_val = group_df['source'].iloc[0] if not group_df.empty else None
        rt_val = group_df['reaction_time'].iloc[0] if not group_df.empty else None
        is_mobile = group_df['is_mobile'].iloc[0] if not group_df.empty else None
        age = group_df['age'].iloc[0] if not group_df.empty else None
        length_val = group_df['length'].iloc[0] if not group_df.empty else None
        id_val = group_df['id'].iloc[0] # Placeholder as it's question-specific

        # Create new row dictionaries for Quality scores if mean is not NaN
        if pd.notna(general_mean):
            new_rows_list.append({
                'test_slug': test_slug,
                'participant_id': participant_id,
                'is_mobile': is_mobile,
                'age': age,
                'id': id_val + '-gq', # Use placeholder
                'response_value': general_mean,
                'length': length_val, # Use placeholder
                'source': source_val, # Use consistent value from group
                'reaction_time': rt_val, 
                'question': 'general_quality' # New question type
            })

        if pd.notna(subjective_mean):
             new_rows_list.append({
                'test_slug': test_slug,
                'participant_id': participant_id,
                'is_mobile': is_mobile,
                'age': age,
                'id': id_val + '-sq',
                'response_value': subjective_mean,
                'length': length_val,
                'source': source_val,
                'reaction_time': rt_val, # Keep the consistent reaction_time value
                'question': 'subjective_quality'
            })

        if pd.notna(objective_mean):
             new_rows_list.append({
                'test_slug': test_slug,
                'participant_id': participant_id,
                'is_mobile': is_mobile,
                'age': age,
                'id': id_val + '-oq',
                'response_value': objective_mean,
                'length': length_val,
                'source': source_val,
                'reaction_time': rt_val, # Keep the consistent reaction_time value
                'question': 'objective_quality'
            })

        # Create a new row for reaction_time, using the value from the column
        # Only add if rt_val is not None/NaN (meaning the group was not empty)
        if pd.notna(rt_val):
             new_rows_list.append({
                'test_slug': test_slug,
                'participant_id': participant_id,
                'is_mobile': is_mobile,
                'age': age,
                'id': id_val + '-rt', # Placeholder
                'response_value': rt_val,
                'length': length_val, # Placeholder
                'source': source_val, # Use consistent value from group
                'reaction_time': rt_val, # Keep the consistent reaction_time value in its column too
                'question': 'reaction_time' # New question type
            })


    # Create a DataFrame from the new rows
    df_new_rows = pd.DataFrame(new_rows_list)

    # Ensure columns are in the same order as the original DataFrame before concatenating
    # Use the columns from the input 'df'
    df_new_rows = df_new_rows[df.columns]

    # Concatenate the original DataFrame and the new rows DataFrame
    # Use the input 'df' for concatenation
    df_extended = pd.concat([df, df_new_rows], ignore_index=True)

    # Drop the old reaction time column as it is not needed anymore
    df_extended = df_extended.drop(['reaction_time'], axis=1)

    print("\nDataFrame with new quality metrics and reaction_time row:")
    # Use .head() to avoid printing potentially large DataFrame
    print(df_extended.sample(n=15))

    print("\nChecking that new DVs are correct:")
    print(df_extended[df_extended['participant_id'] == '144da5ba-b2ef-4861-9e85-7577e9e4ee9a'])


    return df_extended
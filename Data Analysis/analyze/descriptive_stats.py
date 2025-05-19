import pandas as pd

def calculate_descriptive_statistics(df, df_anova_results):
    """
    Calculates and prints descriptive statistics for dependent variables and reaction time.
    Also prints the number of participants per length group and responses per participant and source.
    """
    print("\n--- Descriptive Statistics ---")

    # Print number of participants in each 'length' group
    print("Number of Participants per Length Group:")
    participant_counts_by_length = df.groupby('length')['participant_id'].nunique()
    print(participant_counts_by_length.to_markdown(numalign="left", stralign="left"))
    print("\n") # Add a newline for separation

    # First, create a DataFrame where each row is a unique participant
    # and contains their is_mobile status and age.
    # Aage and is_mobile are consistent for a given participant_id.
    # Using .first() to select one value per participant
    participant_info = df.groupby('participant_id')[['is_mobile', 'age']].first()

    # Perform descriptive statistics on this participant-level data

    # Descriptive statistics for 'is_mobile' among unique participants
    print("Descriptive Statistics for device type (per unique participant):")
    # Value counts on the participant-level mobile status
    participant_mobile_counts = participant_info['is_mobile'].value_counts()
    print(participant_mobile_counts.to_markdown(numalign="left", stralign="left"))
    print("\n")

    # Descriptive statistics for 'age' among unique participants
    print("Descriptive Statistics for age (per unique participant):")
    # .describe() on the participant-level age
    participant_age_description = participant_info['age'].describe()
    print(participant_age_description.to_markdown(numalign="left", stralign="left"))
    print("\n")

    print("Distribution of Responses per Source (Counts):")
    # Group by source and response_value, then count occurrences
    response_distribution_by_source = df.groupby('source')['response_value'].value_counts().sort_index()

    # Unstack to get a table format: Sources as rows, Response Values as columns
    # Fill NaN with 0 for combinations that didn't occur
    response_distribution_table = response_distribution_by_source.unstack(fill_value=0)

    # Ensure columns (response values) are sorted if they are numeric/ordered
    try:
        # Convert column names to numeric if possible for proper sorting
        response_distribution_table.columns = pd.to_numeric(response_distribution_table.columns, errors='raise')
        response_distribution_table = response_distribution_table.sort_index(axis=1)
        # Convert back to string for markdown printing if needed, though often not required
        response_distribution_table.columns = response_distribution_table.columns.astype(str)
    except ValueError:
        # If response_values are not numeric (e.g., strings), sort alphabetically
        response_distribution_table = response_distribution_table.sort_index(axis=1)


    print(response_distribution_table.to_markdown(numalign="left", stralign="left"))
    print("\n") # Add a newline for separation


    print("Dependent Variable Means & Std Dev per Length, Source, and Question:\n")
    # Ensure 'response_value' is numeric, coercing errors will turn non-numeric into NaN
    df['response_value'] = pd.to_numeric(df['response_value'], errors='coerce')
    descriptive_stats_dv = df.groupby(['length', 'source', 'question'])['response_value'].agg(['mean', 'std']).unstack('question')
    print(descriptive_stats_dv.to_markdown(numalign="left", stralign="left"))

    if 'reaction_time' in df.columns:
         print("\nReaction Time Means & Std Dev per Length, Source, and Question:\n")
         # Ensure 'reaction_time' is numeric
         df['reaction_time'] = pd.to_numeric(df['reaction_time'], errors='coerce')
         descriptive_stats_rt = df.groupby(['length', 'source', 'question'])['reaction_time'].agg(['mean', 'std']).unstack('question')
         print(descriptive_stats_rt.to_markdown(numalign="left", stralign="left"))
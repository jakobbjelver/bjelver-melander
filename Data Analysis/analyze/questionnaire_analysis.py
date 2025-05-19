# questionnaire_analysis.py
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
from matplotlib import rcParams
import pingouin as pg 

def analyze_questionnaire_data(df_questionnaire, df_experiment=None, output_dir='plots'):
    """
    Analyzes questionnaire data: calculates descriptive statistics and generates plots.
    Optionally takes df_experiment for potential linking (e.g., comparing post-exp
    data by experimental group), including additional analysis for significant
    group differences in pre and post questionnaires, indicating the direction
    of significant differences.
    """
    print("\n--- Analyzing Questionnaire Data ---")

    if df_questionnaire is None or df_questionnaire.empty:
        print("No questionnaire data provided or loaded. Skipping analysis.")
        return

    # Ensure response_value is numeric, coercing errors will turn non-numeric into NaN
    df_questionnaire['response_value'] = pd.to_numeric(df_questionnaire['response_value'], errors='coerce')
    # Drop rows with missing essential data (participant_id is also essential for merging)
    df_questionnaire = df_questionnaire.dropna(subset=['participant_id', 'response_value', 'questionnaire_type', 'question'])

    if df_questionnaire.empty:
        print("Questionnaire data is empty after cleaning. Skipping analysis.")
        return

    # Calculate Descriptive Statistics for Questionnaire Data
    print("\nDescriptive Statistics for Questionnaire Responses (Mean & Std Dev):")
    descriptive_stats_q = df_questionnaire.groupby(['questionnaire_type', 'question'])['response_value'].agg(['mean', 'std'])
    # Unstack to have questionnaire_type as columns for easier comparison
    descriptive_stats_q_unstacked = descriptive_stats_q.unstack('questionnaire_type')
    print(descriptive_stats_q_unstacked.to_markdown(numalign="left", stralign="left"))


    # --- Generate Plots for Questionnaire Data ---
    print("\n--- Generating Questionnaire Plots ---")
    rcParams['font.family'] = 'Times New Roman' # Use consistent styling

    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    else:
        print(f"Saving plots to existing directory: {output_dir}")

    # Get unique questions and types to plot
    unique_types = df_questionnaire['questionnaire_type'].unique()

    # Plot means for each question, grouped by type
    # Calculate means specifically for plotting
    mean_responses = df_questionnaire.groupby(['questionnaire_type', 'question'])['response_value'].mean().reset_index()

    if mean_responses.empty:
        print("No valid data for plotting questionnaire responses after calculating means.")
        # Don't return here, as we might still do statistical tests below
    else:
        # Define a simple color palette for pre/post
        q_palette = {'pre': 'steelblue', 'post': 'indianred'} # Example colors

        for q_type in unique_types:
            df_plot_type = mean_responses[mean_responses['questionnaire_type'] == q_type].copy()
            if df_plot_type.empty:
                continue

            fig, ax = plt.subplots(figsize=(10, 6)) # Adjust size as needed

            # Use question as x-axis, mean response_value as y-axis
            # Simple bar plot for each question within the type
            sns.barplot(data=df_plot_type, x='question', y='response_value', ax=ax, color=q_palette.get(q_type, 'gray')) # Use color from palette

            ax.set_title(f'Mean Responses for {q_type.capitalize()} Questionnaire')
            ax.set_xlabel('Question')
            ax.set_ylabel('Mean Response Value')
            ax.grid(axis='y', linestyle='--', alpha=0.7)
            plt.xticks(rotation=45, ha='right') # Rotate labels if they overlap
            plt.tight_layout()

            filename = os.path.join(output_dir, f'{q_type}_questionnaire_means_barplot.png')
            try:
                plt.savefig(filename, dpi=300)
                print(f"Saved plot to: {filename}")
            except Exception as e:
                print(f"Error saving plot {filename}: {e}")
            finally:
                plt.close(fig) # Close plot to free memory


    # --- Aanalysis comparing PRE-EXPERIMENT questions by experiment group ---
    if df_experiment is not None and not df_experiment.empty:
        print("\n--- Analyzing Pre-Experiment Questions by Experiment Length Group ---")
        # Get participant length group from experiment data (one length per participant)
        participant_length = df_experiment[['participant_id', 'length']].drop_duplicates()

        # Filter for pre-experiment questionnaire data
        df_pre_q = df_questionnaire[df_questionnaire['questionnaire_type'] == 'pre'].copy()

        if df_pre_q.empty:
            print("No pre-experiment questionnaire data found for group comparison.")
        else:
            # Merge pre-exp data with participant length info
            df_pre_merged = pd.merge(df_pre_q, participant_length, on='participant_id', how='left')

            if df_pre_merged['length'].nunique() < 2:
                print("Not enough unique length groups to compare pre-experiment questions.")
            else:
                # Get unique pre questions
                pre_questions = df_pre_q['question'].unique()

                # Perform independent samples t-test for each pre question by length group
                # (Using t-test here because of 2 length groups)
                print("\nIndependent t-tests for Pre-Experiment Questions by Length Group:")
                results_list = []
                for question in pre_questions:
                    df_q = df_pre_merged[df_pre_merged['question'] == question].copy().dropna(subset=['response_value', 'length'])

                    if df_q['length'].nunique() < 2:
                         print(f"Skipping t-test for '{question}': Not enough length groups with data.")
                         continue

                    group_longer = df_q[df_q['length'] == 'longer']['response_value']
                    group_shorter = df_q[df_q['length'] == 'shorter']['response_value']

                    if len(group_longer) < 2 or len(group_shorter) < 2: # Need at least 2 samples per group for t-test
                         print(f"Skipping t-test for '{question}': Not enough data points in both length groups ({len(group_longer)} in longer, {len(group_shorter)} in shorter).")
                         continue

                    try:
                        ttest_result = pg.ttest(x=group_longer, y=group_shorter, paired=False)
                        ttest_result['Question'] = question
                        results_list.append(ttest_result)

                        # --- Additional analysis for significant pre-experiment questions ---
                        if ttest_result['p-val'].iloc[0] < 0.1:
                            print(f"\nSignificant difference found for '{question}' (p < 0.1). Additional details:")
                            mean_longer = group_longer.mean()
                            std_longer = group_longer.std()
                            mean_shorter = group_shorter.mean()
                            std_shorter = group_shorter.std()
                            print(f"  'longer' group: Mean = {mean_longer:.2f}, Std Dev = {std_longer:.2f}")
                            print(f"  'shorter' group: Mean = {mean_shorter:.2f}, Std Dev = {std_shorter:.2f}")

                            # Indicate the direction of the significant difference
                            if mean_longer > mean_shorter:
                                print(f"  Direction: 'longer' group has a higher mean response.")
                            elif mean_shorter > mean_longer:
                                print(f"  Direction: 'shorter' group has a higher mean response.")
                            else:
                                print(f"  Direction: Means are equal (though statistically significant difference was detected, check test details).")


                    except Exception as e:
                        print(f"Error performing t-test for '{question}': {e}")

                if results_list:
                    all_ttest_results = pd.concat(results_list, ignore_index=True)
                    # Reorder columns for readability
                    cols = ['Question'] + [col for col in all_ttest_results.columns if col != 'Question']
                    all_ttest_results = all_ttest_results[cols]
                    print("\nSummary of Independent t-tests (Pre-Experiment):")
                    print(all_ttest_results.to_markdown(index=False, numalign="left", stralign="left"))
                else:
                    print("No t-tests could be performed for pre-experiment questions with sufficient data.")


    # --- Analysis comparing POST-EXPERIMENT questions by experiment group ---
    if df_experiment is not None and not df_experiment.empty:
        print("\n--- Analyzing Post-Experiment Questions by Experiment Length Group ---")
        # Get participant length group from experiment data (one length per participant)
        participant_length = df_experiment[['participant_id', 'length']].drop_duplicates()

        # Filter for post-experiment questionnaire data
        df_post_q = df_questionnaire[df_questionnaire['questionnaire_type'] == 'post'].copy()

        if df_post_q.empty:
            print("No post-experiment questionnaire data found for group comparison.")
        else:
            # Merge post-exp data with participant length info
            df_post_merged = pd.merge(df_post_q, participant_length, on='participant_id', how='left')

            if df_post_merged['length'].nunique() < 2:
                print("Not enough unique length groups to compare post-experiment questions.")
            else:
                # Get unique post questions
                post_questions = df_post_q['question'].unique()

                # Perform independent samples t-test for each post question by length group
                # (Using t-test here because of 2 length groups)
                print("\nIndependent t-tests for Post-Experiment Questions by Length Group:")
                results_list = []
                for question in post_questions:
                    df_q = df_post_merged[df_post_merged['question'] == question].copy().dropna(subset=['response_value', 'length'])

                    if df_q['length'].nunique() < 2:
                         print(f"Skipping t-test for '{question}': Not enough length groups with data.")
                         continue

                    group_longer = df_q[df_q['length'] == 'longer']['response_value']
                    group_shorter = df_q[df_q['length'] == 'shorter']['response_value']

                    if len(group_longer) < 2 or len(group_shorter) < 2: # Need at least 2 samples per group for t-test
                         print(f"Skipping t-test for '{question}': Not enough data points in both length groups ({len(group_longer)} in longer, {len(group_shorter)} in shorter).")
                         continue

                    try:
                        ttest_result = pg.ttest(x=group_longer, y=group_shorter, paired=False)
                        ttest_result['Question'] = question
                        results_list.append(ttest_result)

                         # --- Additional analysis for significant post-experiment questions ---
                        if ttest_result['p-val'].iloc[0] < 0.1:
                            print(f"\nSignificant difference found for '{question}' (p < 0.1). Additional details:")
                            mean_longer = group_longer.mean()
                            std_longer = group_longer.std()
                            mean_shorter = group_shorter.mean()
                            std_shorter = group_shorter.std()
                            print(f"  'longer' group: Mean = {mean_longer:.2f}, Std Dev = {std_longer:.2f}")
                            print(f"  'shorter' group: Mean = {mean_shorter:.2f}, Std Dev = {std_shorter:.2f}")

                            # Indicate the direction of the significant difference
                            if mean_longer > mean_shorter:
                                print(f"  Direction: 'longer' group has a higher mean response.")
                            elif mean_shorter > mean_longer:
                                print(f"  Direction: 'shorter' group has a higher mean response.")
                            else:
                                print(f"  Direction: Means are equal (though statistically significant difference was detected, check test details).")


                    except Exception as e:
                        print(f"Error performing t-test for '{question}': {e}")

                if results_list:
                    all_ttest_results = pd.concat(results_list, ignore_index=True)
                    # Reorder columns for readability
                    cols = ['Question'] + [col for col in all_ttest_results.columns if col != 'Question']
                    all_ttest_results = all_ttest_results[cols]
                    print("\nSummary of Independent t-tests (Post-Experiment):")
                    print(all_ttest_results.to_markdown(index=False, numalign="left", stralign="left"))
                else:
                    print("No t-tests could be performed for post-experiment questions with sufficient data.")
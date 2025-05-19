# integrated_analysis.py - Version with cleaned labels (source prefix removed from axes)

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
from matplotlib import rcParams
import numpy as np

def aggregate_experiment_data(df):
    """
    Aggregates key experiment metrics (mean response_value per question)
    to the participant level, with source and question combined in column names.
    (This function is correct from the previous step for structuring the data)
    """
    if df is None or df.empty:
        print("No experiment data provided for aggregation.")
        return pd.DataFrame()

    print("\n--- Aggregating Experiment Data to Participant Level (Source in Columns) ---")

    # Ensure response_value is numeric; coerce errors will turn non-numeric into NaN
    df['response_value'] = pd.to_numeric(df['response_value'], errors='coerce')

    # Filter out rows with missing essential data before aggregation
    df_clean = df.dropna(subset=['participant_id', 'source', 'question', 'response_value'])

    if df_clean.empty:
        print("Experiment data empty after cleaning for aggregation.")
        return pd.DataFrame()

    # Pivot to get mean response_value for each combination of source and question per participant
    # This will create a MultiIndex for columns: (source, question)
    try:
        df_agg = df_clean.pivot_table(
            index='participant_id',       # Participant ID becomes the index (one row per participant)
            columns=['source', 'question'], # Source and Question become column levels
            values='response_value',
            aggfunc='mean' # Calculate mean response for each source/question combination per participant
        )

        # Flatten column MultiIndex: join levels with _mean_
        # df_agg.columns is now a MultiIndex like [(source1, q1), (source1, q2), (source2, q1), ...]
        df_agg.columns = [f'{col[0]}_mean_{col[1]}' for col in df_agg.columns.tolist()]

        # reset_index() to make participant_id a regular column again
        df_agg = df_agg.reset_index()

        print("Experiment data aggregation complete with source in column names. Head:")
        print(df_agg.head().to_markdown(numalign="left", stralign="left"))
        return df_agg

    except Exception as e:
        print(f"Error during experiment data aggregation: {e}")
        # Added some debugging info in case the error persists
        if 'df_clean' in locals():
             print("\n--- Debugging Info (df_clean) ---")
             print("df_clean columns:", df_clean.columns.tolist())
             print("df_clean dtypes:", df_clean.dtypes)
             print("df_clean head:\n", df_clean.head().to_markdown())
             print("\n---------------------------------")
        if 'df_agg' in locals(): # This will be the state before flattening
             print("\n--- Debugging Info (df_agg before flattening) ---")
             print("df_agg columns:", df_agg.columns.tolist())
             print("df_agg head:\n", df_agg.head().to_markdown())
             print("\n---------------------------------")

        return pd.DataFrame()


def wrangle_questionnaire_data(df):
    """
    Wrangls questionnaire data to a wide format (participant level)
    with columns for each question distinguishing pre/post.
    (This function remains largely the same as questionnaire data isn't source-specific)
    """
    if df is None or df.empty:
        print("No questionnaire data provided for wrangling.")
        return pd.DataFrame()

    print("\n--- Wrangling Questionnaire Data to Participant Level ---")

    # Ensure response_value is numeric; coerce errors will turn non-numeric into NaN
    df['response_value'] = pd.to_numeric(df['response_value'], errors='coerce')

    # Filter out rows with missing essential data before pivoting
    df_clean = df.dropna(subset=['participant_id', 'questionnaire_type', 'question', 'response_value'])

    if df_clean.empty:
        print("Questionnaire data empty after cleaning for wrangling.")
        return pd.DataFrame()

    # Pivot to get response_value for each question type and questionnaire_type per participant
    # Use mean in case there are multiple entries for a participant/question (unlikely but safe)
    try:
        df_q_wide = df_clean.pivot_table(
            index='participant_id',
            columns=['questionnaire_type', 'question'],
            values='response_value',
            aggfunc='mean'
        )

        # Flatten column MultiIndex: join levels with an underscore
        df_q_wide.columns = [f'{col[0]}_{col[1]}' for col in df_q_wide.columns]

        print("Questionnaire data wrangling complete. Head:")
        print(df_q_wide.head().to_markdown(numalign="left", stralign="left"))
        return df_q_wide.reset_index() # Convert index back to column

    except Exception as e:
        print(f"Error during questionnaire data wrangling: {e}")
        return pd.DataFrame()

# Modified _plot_correlation_heatmap to handle source prefix removal from labels
def _plot_correlation_heatmap(correlation_matrix, title, filename, source_prefix=None, output_dir='plots'):
    """
    Helper function to generate and save a correlation heatmap with cleaned labels,
    optionally removing a source prefix from experiment outcome labels.
    """
    if correlation_matrix.empty or correlation_matrix.shape[0] < 2:
        print(f"Correlation matrix for '{title}' is empty or too small (less than 2 variables). Skipping plot.")
        return

    print(f"\n--- Generating Heatmap: {title} ---")
    rcParams['font.family'] = 'Times New Roman'

    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    else:
        print(f"Saving plots to existing directory: {output_dir}")

    # Adjust figure size dynamically based on the number of variables
    num_vars = correlation_matrix.shape[0]
    fig_size = max(6, min(25, num_vars * 0.7)) # Adjusted scaling factor and max size
    fig, ax = plt.subplots(figsize=(fig_size, fig_size))

    # --- Clean up labels for correlation plot ---
    original_labels = correlation_matrix.columns
    cleaned_labels = []
    for label in original_labels:
        cleaned_label = label

        # 1. Attempt to remove source prefix + '_mean_' specifically from experiment labels
        if source_prefix and cleaned_label.startswith(f'{source_prefix}_mean_'):
            # Remove the prefix (e.g., 'AI_mean_accuracy' -> 'accuracy')
            cleaned_label = cleaned_label[len(f'{source_prefix}_mean_'):]
        # Note: Questionnaire labels ('pre_...', 'post_...') will not start with source_prefix_mean_

        # 2. Apply general cleaning (replace remaining underscores, title case)
        cleaned_label = cleaned_label.replace('_', ' ').title()

        # 3. Fix common acronyms/terms that title() might mess up
        # These checks apply after general cleaning, so handle spaces around acronyms
        cleaned_label = cleaned_label.replace(' Ai ', ' AI ')
        cleaned_label = cleaned_label.replace(' Rt ', ' RT ') # Example if RT (response time) exists
        cleaned_label = cleaned_label.replace(' Gglm ', ' GGLM ') # Example if GGLM exists

        cleaned_labels.append(cleaned_label)


    mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))

    sns.heatmap(correlation_matrix, mask=mask, annot=True, fmt=".2f", cmap='coolwarm',
                vmin=-1, vmax=1, center=0, square=True, linewidths=.5, cbar_kws={"shrink": .5},
                xticklabels=cleaned_labels, yticklabels=cleaned_labels, ax=ax) # Use cleaned labels here

    ax.set_title(title)
    plt.tight_layout()

    filepath = os.path.join(output_dir, filename)
    try:
        plt.savefig(filepath, dpi=300)
        print(f"Saved plot to: {filepath}")
    except Exception as e:
        print(f"Error saving plot {filepath}: {e}")
    finally:
        plt.close(fig) # Close plot


def perform_correlation_analysis(df_exp_agg, df_q_wide, output_dir='plots'):
    """
    Merges aggregated experiment data (with source distinction) and wrangled
    questionnaire data and performs and plots correlation analysis
    separately for each source for pre and post questions.
    """
    if df_exp_agg.empty or df_q_wide.empty:
        print("\n--- Skipping Correlation Analysis: Aggregated data is empty ---")
        print("Experiment aggregated data (with source) empty:", df_exp_agg.empty)
        print("Questionnaire wide data empty:", df_q_wide.empty)
        return

    print("\n--- Performing Source-Specific Correlation Analysis ---")

    # Merge the two participant-level dataframes
    df_merged = pd.merge(df_exp_agg, df_q_wide, on='participant_id', how='outer')

    if df_merged.empty:
        print("Merged data is empty after merging. Skipping correlation.")
        return

    # Identify column groups
    # Pre-questionnaire columns start with 'pre_', EXCLUDING 'pre_ai_familiarity'
    pre_q_cols = [col for col in df_merged.columns if col.startswith('pre_') and col != 'pre_ai_familiarity']
    # Post-questionnaire columns start with 'post_'
    post_q_cols = [col for col in df_merged.columns if col.startswith('post_')]

    # Identify unique sources from the aggregated experiment outcome column names
    source_exp_cols_patterns = [col for col in df_merged.columns if '_mean_' in col]
    unique_sources = sorted(list(set(col.split('_mean_')[0] for col in source_exp_cols_patterns)))

    if not unique_sources:
        print("Could not identify any source-specific experiment outcome columns (e.g., AI_mean_accuracy). Skipping source-specific correlation plots.")
        if not pre_q_cols and not post_q_cols:
             print("No pre or post questionnaire columns found either.")
        return

    print(f"Identified sources for correlation: {unique_sources}")

    # Define a mapping for source names in titles for proper capitalization
    source_title_map = {
        'ai': 'AI',
        'programmatic': 'Programmatic',
        'original': 'Original'
    }


    # --- Generate Plots for each Source ---
    for source in unique_sources:
        print(f"\nProcessing source: {source}")

        # Identify experiment outcome columns specific to this source
        source_exp_cols = [col for col in df_merged.columns if col.startswith(f'{source}_mean_')]

        if not source_exp_cols:
            print(f"No experiment outcome columns found for source '{source}' ({source}_mean_* pattern). Skipping plots for this source.")
            continue

        # Get the display name for the title
        source_display_name = source_title_map.get(source, source.title()) # Use map, default to title()

        # --- Correlation Plot: Source Experiment Outcomes and Pre-Experiment Questionnaire ---
        plot_cols_pre = source_exp_cols + pre_q_cols
        if plot_cols_pre and len(plot_cols_pre) > 1:
             df_plot_pre = df_merged[plot_cols_pre].select_dtypes(include=[np.number])
             if df_plot_pre.shape[1] > 1:
                 pre_correlation_matrix = df_plot_pre.corr()
                 # Create specific title and filename
                 title_pre = f'Correlation Matrix: {source_display_name} Exp. Outcomes and Pre-Exp. Questionnaire'
                 filename_pre = f'{source.lower()}_pre_correlation_heatmap.png' # Use lower case for filenames
                 # Pass the source to the plotting function for label cleaning
                 _plot_correlation_heatmap(pre_correlation_matrix,
                                           title_pre,
                                           filename_pre,
                                           source_prefix=source, # Pass the source
                                           output_dir=output_dir)
             else:
                 print(f"Not enough numeric variables ({df_plot_pre.shape[1]}) for {source} Pre-experiment correlation plot after selecting numeric types.")
        else:
             print(f"Skipping {source} Pre-experiment correlation plot: Not enough variables ({len(plot_cols_pre)}). Need at least 2 numeric columns.")


        # --- Correlation Plot: Source Experiment Outcomes and Post-Experiment Questionnaire ---
        plot_cols_post = source_exp_cols + post_q_cols
        if plot_cols_post and len(plot_cols_post) > 1:
             df_plot_post = df_merged[plot_cols_post].select_dtypes(include=[np.number])
             if df_plot_post.shape[1] > 1:
                 post_correlation_matrix = df_plot_post.corr()
                 # Create specific title and filename
                 title_post = f'Correlation Matrix: {source_display_name} Exp. Outcomes and Post-Exp. Questionnaire'
                 filename_post = f'{source.lower()}_post_correlation_heatmap.png' # Use lower case for filenames
                 # Pass the source to the plotting function for label cleaning
                 _plot_correlation_heatmap(post_correlation_matrix,
                                           title_post,
                                           filename_post,
                                           source_prefix=source, # Pass the source
                                           output_dir=output_dir)
             else:
                 print(f"Not enough numeric variables ({df_plot_post.shape[1]}) for {source} Post-experiment correlation plot after selecting numeric types.")
        else:
             print(f"Skipping {source} Post-experiment correlation plot: Not enough variables ({len(plot_cols_post)}). Need at least 2 numeric columns.")


    print("\nSource-specific correlation analysis complete.")


# Main function to orchestrate integrated analysis
def analyze_integrated_data(df_experiment, df_questionnaire, output_dir='plots'):
     """
     Orchestrates the aggregation of experiment data, wrangling of questionnaire data,
     and correlation analysis between the two, broken down by experiment source.
     """
     if df_experiment is None or df_questionnaire is None:
         print("\n--- Skipping integrated analysis: One or both dataframes are missing ---")
         return

     df_exp_agg = aggregate_experiment_data(df_experiment)
     df_q_wide = wrangle_questionnaire_data(df_questionnaire)

     # Only proceed if both aggregated dataframes are valid
     if not df_exp_agg.empty and not df_q_wide.empty:
        perform_correlation_analysis(df_exp_agg, df_q_wide, output_dir=output_dir)
     else:
         print("\n--- Skipping correlation analysis due to empty aggregated data ---")
# main_analysis.py
# Import necessary modules
from .data_handling import load_and_inspect_data, check_data_completeness, create_new_dvs
from .anova_analysis import perform_mixed_anova, perform_anova_posthoc
from .bayesian_analysis import analyze_accuracy_bayesian
from .descriptive_stats import calculate_descriptive_statistics
from .plotting import generate_plots
# Import the new integrated analysis function
from .integrated_analysis import analyze_integrated_data
from .questionnaire_analysis import analyze_questionnaire_data
import pandas as pd # Keep pandas import


def analyze_data():
    # Load and inspect data - loads both experiment and questionnaire data
    df_experiment, df_questionnaire = load_and_inspect_data(
        experiment_file='data/test_data_evaluated.csv',
        questionnaire_file='data/questionnaire_data_wrangled.csv'
    )

    # Check if experiment data loaded successfully, essential
    if df_experiment is None:
        print("\nFATAL ERROR: Experiment data failed to load. Cannot proceed with analysis.")

        if df_questionnaire is not None:
             print("However, questionnaire data loaded. You could add code here for standalone questionnaire analysis if needed.")
        return

    # Warn if questionnaire data is missing, but allow experiment analysis to proceed
    if df_questionnaire is None:
         print("\nWARNING: Questionnaire data failed to load. Skipping integrated analysis (which requires both datasets).")


    # --- Analyze Experiment Data (Existing Logic) ---
    print("\n--- Analyzing Experiment Data ---")

    # Check data completeness for ANOVA - this uses df_experiment
    participants_to_exclude = check_data_completeness(df_experiment)

    # Make 3 new dep variables = General Quality, Objective Quality (accuracy + comprehension), Subjective Quality (confidence, satisfaction, effort)
    df_experiment = create_new_dvs(df_experiment)

    # Define dependent variables for ANOVA (these are 'question' values in df_experiment)
    dependent_vars_anova = ['confidence', 'comprehension', 'satisfaction', 'effort', 'reaction_time', 'general_quality', 'subjective_quality', 'objective_quality'] # Ensure these match your data
    anova_results = {}
    for dv in dependent_vars_anova:
        # Pass df_experiment to the ANOVA function
        aov_table, df_anova = perform_mixed_anova(df_experiment, dv)
        anova_results[dv] = {'table': aov_table, 'data': df_anova}
        if aov_table is not None and df_anova is not None:
            perform_anova_posthoc(aov_table, df_anova, dv)
        else:
            print(f"WARNING: ANOVA tables for {dv} are none.")

    # Analyze accuracy using Bayesian mixed-effects logistic regression (on experiment data)
    analyze_accuracy_bayesian(df_experiment) # Pass df_experiment

    # Calculate descriptive statistics (primarily for experiment data structure and ANOVAs)
    calculate_descriptive_statistics(df_experiment, anova_results) # Pass df_experiment

    # Generate plots (primarily for experiment data DVs and Decision Quality)
    generate_plots(df_experiment) # Pass df_experiment

    # --- Integrated Analysis (Experiment Outcomes & Questionnaire Responses) ---
    # Perform analysis combining experiment and questionnaire data, including correlation
    if df_questionnaire is not None: # Only run integrated analysis if questionnaire data loaded
         analyze_integrated_data(df_experiment, df_questionnaire)
         analyze_questionnaire_data(df_questionnaire, df_experiment)
    else:
         print("\nSkipping integrated analysis due to missing questionnaire data.")


if __name__ == "__main__":
    analyze_data()
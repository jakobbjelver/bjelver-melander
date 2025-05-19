import pandas as pd
from statsmodels.genmod.bayes_mixed_glm import BinomialBayesMixedGLM
import numpy as np
from scipy.stats import norm # Import for calculating intervals

def analyze_accuracy_bayesian(df):
    """Performs Bayesian mixed-effects logistic regression for accuracy."""
    print("\n--- Bayesian Mixed-Effects Logistic Regression for Accuracy ---")
    df_accuracy = df[df['question'] == 'accuracy'].copy()

    if df_accuracy.empty:
        print("No accuracy data found. Skipping Bayesian model.")
        return

    print("--- Initial Data Info ---")
    print(df_accuracy.info())
    print(df_accuracy.head())

    df_accuracy = df_accuracy.rename(columns={'response_value': 'accuracy'})
    # Ensure accuracy is binary (0 or 1)
    df_accuracy['accuracy'] = pd.to_numeric(df_accuracy['accuracy'], errors='coerce')
    if not df_accuracy['accuracy'].dropna().isin([0, 1]).all():
         print("\nError: 'accuracy' column contains values other than 0 or 1 after conversion.")
         print("Unique values in accuracy:", df_accuracy['accuracy'].dropna().unique())
         print("Skipping Bayesian model due to invalid accuracy values.")
         return

    df_accuracy['accuracy'] = df_accuracy['accuracy'].astype(int)

    # Convert to category *after* checking values if needed
    df_accuracy['length'] = df_accuracy['length'].astype('category')
    df_accuracy['source'] = df_accuracy['source'].astype('category')
    df_accuracy['participant_id'] = df_accuracy['participant_id'].astype('category')

    # Drop NaNs *after* conversions and initial checks
    initial_rows = len(df_accuracy)
    df_accuracy = df_accuracy.dropna(subset=['accuracy', 'length', 'source', 'participant_id'])
    if len(df_accuracy) < initial_rows:
        print(f"\nWarning: Dropped {initial_rows - len(df_accuracy)} rows due to NaN values in key columns.")


    print("\n--- Data Checks Before Model Fitting ---")

    # Check unique values of categorical variables
    print("\nUnique 'length' categories:", df_accuracy['length'].cat.categories.tolist())
    print("Unique 'source' categories:", df_accuracy['source'].cat.categories.tolist())
    print("Unique 'participant_id' categories:", df_accuracy['participant_id'].cat.categories.tolist())

    # Check distribution of the outcome variable
    print("\nDistribution of 'accuracy':")
    print(df_accuracy['accuracy'].value_counts())
    print(df_accuracy['accuracy'].value_counts(normalize=True))

    # Check data points per participant
    print("\nObservations per participant:")
    participant_counts = df_accuracy['participant_id'].value_counts()
    print(participant_counts.describe())
    print(participant_counts.head())
    if (participant_counts < 2).any():
          print("\nWarning: Some participants have very few observations (< 2). This can cause issues.")

    # Check data distribution across fixed effects (Length x Source)
    print("\nObservations per Length x Source group:")
    cross_tab_fixed = pd.crosstab(df_accuracy['length'], df_accuracy['source'])
    print(cross_tab_fixed)
    if (cross_tab_fixed < 5).any().any():
          print("\nWarning: Some Length x Source groups have very few observations (< 5).")

    # Check distribution of accuracy (proportion correct) across fixed effects groups
    print("\nProportion of Correct Responses (accuracy=1) per Length x Source group:")
    accuracy_by_group = df_accuracy.groupby(['length', 'source'])['accuracy'].agg(['count', 'mean', 'sum'])
    print(accuracy_by_group)
    # Check for potential perfect separation (all 0s or all 1s in a group)
    if (accuracy_by_group['mean'] == 0).any() or (accuracy_by_group['mean'] == 1).any():
        print("\nWarning: Potential perfect separation detected. Some Length x Source groups have 0% or 100% accuracy.")
        print("This can cause model fitting issues.")

    # Check data distribution including random effects (Participant x Length x Source)
    print("\nObservations per Participant x Length x Source combination:")
    participant_group_counts = df_accuracy.groupby(['participant_id', 'length', 'source']).size().unstack(fill_value=0)
    print(participant_group_counts.head())
    print("\nSummary of observations per Participant x Length x Source combination:")
    print(participant_group_counts.stack().describe())

    if (participant_group_counts == 0).values.any():
        print("\nWarning: Some Participant x Length x Source combinations have 0 observations.")
        print("Example participants with missing combinations:\n", participant_group_counts[participant_group_counts.eq(0).any(axis=1)].head())


    fixed_effects_formula = "accuracy ~ C(length) * C(source)"
    random_effects_formulas = {'participant': '0 + C(participant_id)'}


    print("\n--- Attempting Bayesian Model Fitting ---")
    try:
        mixed_model = BinomialBayesMixedGLM.from_formula(
            formula=fixed_effects_formula,
            vc_formulas=random_effects_formulas,
            data=df_accuracy
        )
        mixed_model_fit = mixed_model.fit_vb()
        print(mixed_model_fit.summary())

        # print("\n--- Approximate 95% Credible Intervals for Fixed Effects (Log-Odds) ---") # Old

        # Get the posterior mean and standard deviation for fixed effects
        fe_mean = mixed_model_fit.fe_mean
        fe_sd = mixed_model_fit.fe_sd
        fe_names = mixed_model_fit.model.exog_names # Get names for fixed effects

        # Calculate approximate 95% CI using mean +/- 1.96*SD (for standard normal distribution)
        # For a 95% CI, alpha = 0.05, so we need the Z-score for alpha/2 = 0.025
        z_score_95 = norm.ppf(1 - 0.05/2) # This is approximately 1.96

        fe_ci_lower = fe_mean - z_score_95 * fe_sd
        fe_ci_upper = fe_mean + z_score_95 * fe_sd

        # Create a DataFrame to display the results nicely
        fixed_effects_ci_df = pd.DataFrame({
            'mean': fe_mean,
            'sd': fe_sd,
            '95% CI Lower': fe_ci_lower,
            '95% CI Upper': fe_ci_upper
        }, index=fe_names)

        print(fixed_effects_ci_df)


        print("\n--- Interpretation Guidance (Bayesian Mixed-Effects Logistic Regression) ---")
        print("Based on the summary output above and the CIs printed below:") # Point to the table below
        print("Your model predicts the log-odds of a correct response (accuracy=1).")
        print("Higher log-odds correspond to a higher probability of being correct.")
        print("The fixed effects are the average effects across all participants, accounting for the random participant variability.")
        print("The random effect captures the variability in accuracy *between* participants.")

        print("\n1. Random Effects: Participant Variability")
        print("Look at the 'vc_params' section in the summary (often towards the bottom).")
        print("Find the row for 'participant'. The value represents the estimated variance in log-odds of accuracy across participants.")
        print("Examine the estimated mean and standard deviation for the 'participant' variance.")
        print("If the estimated mean variance is substantially larger than its standard deviation, it suggests meaningful variation between participants.")


        print("\n2. Fixed Effects: Length, Source, and Interaction")
        print("Look at the 'fe_params' section in the summary and the 'Approximate 95% Credible Intervals' table printed below.") # Point to both
        print("This section and table show the estimated effects (log-odds) for the intercept, main effects of Length and Source, and their interaction.")
        print("Statsmodels uses 'dummy' coding by default for C() terms, treating one level of each category as a 'reference'.")
        print("Identify the reference levels for Length and Source in the summary (e.g., 'C(length)[T.<level>]' indicates '<level>' is *not* the reference).")

        print("\nInterpretation of Coefficients (Log-Odds Differences):")
        print("- Intercept: This is the estimated posterior mean log-odds of accuracy for a participant with an 'average' random effect, in the 'reference' Length condition AND the 'reference' Source condition.")
        print("- C(length)[T.<other_level>]: The estimated posterior mean difference in log-odds of accuracy between '<other_level>' length and the 'reference' length, when the Source is at its 'reference' level.")
        print("- C(source)[T.<other_level>]: The estimated posterior mean difference in log-odds of accuracy between '<other_level>' source and the 'reference' source, when the Length is at its 'reference' level.")
        print("- C(length)[T.<level1>]:C(source)[T.<level2>]: The *additional* estimated posterior mean difference in log-odds of accuracy when *both* Length is '<level1>' and Source is '<level2>', above and beyond the separate effects of those levels.")
        print("   This term quantifies the interaction: whether the effect of Source depends on Length, or vice-versa.")

        print("\nEvidence for Effects (Approximate Credible Intervals):")
        print("For each fixed effect coefficient, look at its Approximate 95% Credible Interval (CI) in the table printed below.") # Point to the CI table
        print("- If the 95% CI for a coefficient **does not contain zero**, based on the VB approximation, it provides evidence that the true effect (difference in log-odds) is likely non-zero.")
        print("- If the 95% CI **does contain zero**, based on the VB approximation, there is not strong evidence for a non-zero effect (difference) at the 95% credibility level.")

        print("\nInterpreting the Interaction:")
        print("First, examine the Approximate 95% CI for the interaction term(s) C(length):C(source) in the table below.") # Point to the CI table
        print("- **If the interaction CI *does not* contain zero:** This indicates there is evidence that the effect of Source on accuracy is different depending on the Length (or vice versa). You should be cautious about interpreting the main effects of Length and Source in isolation. Instead, you need to consider the effects of Source *at each level of Length* (or vice versa). The main effect coefficients represent differences only at the reference level of the other variable when an interaction is present.")
        print("- **If the interaction CI *does* contain zero:** This indicates there is not strong evidence for a Length x Source interaction. You can then more confidently interpret the main effects of Length and Source as representing average differences in accuracy across the levels of the other variable.")

        print("\nInterpreting Main Effects (If Interaction is NOT Credible):")
        print("- If the CI for C(length)[T.<other_level>] does not contain zero, there is evidence that accuracy differs between '<other_level>' length and the 'reference' length, averaged across all Source conditions.")
        print("- If the CI for C(source)[T.<other_level>] does not contain zero, there is evidence that accuracy differs between '<other_level>' source and the 'reference' source, averaged across both Length conditions.")

        print("\nRemember: These are effects on the LOG-ODDS scale. To think about probabilities, you can exponentiate the coefficients to get odds ratios (e.g., exp(coefficient) is the odds ratio comparing a level to the reference), but interpreting log-odds directly is standard for understanding the model.")
        print("\nNote: The credible intervals calculated here are based on the Variational Bayes approximation assuming Gaussian posteriors. For more precise intervals, especially with complex models or limited data, consider using MCMC methods if available and feasible.")


    except ImportError as e:
        print(f"Import Error: {e}")
        print("Please ensure you have statsmodels installed (pip install statsmodels) and scipy (pip install scipy).")
    except Exception as e:
        print(f"\nError during Bayesian model fitting: {e}")
        print("\nDebugging Info (after checks):")
        print(df_accuracy.info())
        print(df_accuracy.head())
        print("\nValue counts of accuracy:")
        print(df_accuracy['accuracy'].value_counts())
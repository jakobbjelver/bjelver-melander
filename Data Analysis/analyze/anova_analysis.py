import pandas as pd
import pingouin as pg

def perform_mixed_anova(df, dv):
    """Performs a mixed ANOVA for a given dependent variable."""
    print(f"\n--- Mixed ANOVA for {dv}---")
    df_dv = df[df['question'] == dv].copy()

    if df_dv.empty:
        print(f"No data found for dependent variable: {dv}. Skipping ANOVA.")
        return None, None

    df_dv = df_dv.rename(columns={'response_value': dv})
    df_dv['source'] = df_dv['source'].astype('category')
    df_dv['length'] = df_dv['length'].astype('category')
    df_dv['participant_id'] = df_dv['participant_id'].astype('category')

    participant_source_counts = df_dv.groupby(['participant_id', 'source']).size().reset_index(name='count')
    participants_with_missing_sources = participant_source_counts.groupby('participant_id').filter(lambda x: len(x) < df_dv['source'].cat.categories.size)['participant_id'].unique()

    if len(participants_with_missing_sources) > 0:
        print(f"Warning: Participants missing 'source' data for '{dv}': {list(participants_with_missing_sources)}")

    try:
        aov = pg.mixed_anova(data=df_dv,
                             dv=dv,
                             within='source',
                             between='length',
                             subject='participant_id')
        print(aov.to_markdown(index=False, numalign="left", stralign="left"))
        return aov, df_dv
    except Exception as e:
        print(f"Error performing mixed ANOVA for {dv}: {e}")
        print("\nDebugging Info:")
        print(df_dv.info())
        print(df_dv.head())
        return None, None

def perform_anova_posthoc(aov_table, df, dv):
    """Performs post-hoc tests based on significant ANOVA results."""
    if aov_table is None:
        return

    alpha = 0.1
    source_p_unc = aov_table.loc[aov_table['Source'] == 'source', 'p-unc'].iloc[0] if 'source' in aov_table['Source'].values else 1.0
    interaction_p_unc = aov_table.loc[aov_table['Source'] == 'Interaction', 'p-unc'].iloc[0] if 'Interaction' in aov_table['Source'].values else 1.0
    length_p_unc = aov_table.loc[aov_table['Source'] == 'length', 'p-unc'].iloc[0] if 'length' in aov_table['Source'].values else 1.0

    if interaction_p_unc < alpha:
        print(f"\n--- Post-hoc tests for significant Interaction effect for {dv} ---")
        pg_posthoc = pg.pairwise_ttests(data=df, dv=dv, within='source', between='length',
                                         subject='participant_id', padjust='bonf')
        print(pg_posthoc.to_markdown(index=False, numalign="left", stralign="left"))
    elif source_p_unc < alpha:
        print(f"\n--- Post-hoc tests for significant Source main effect for {dv} ---")
        pg_posthoc = pg.pairwise_ttests(data=df, dv=dv, within='source', subject='participant_id', padjust='bonf')
        print(pg_posthoc.to_markdown(index=False, numalign="left", stralign="left"))
    elif length_p_unc < alpha:
        print(f"\nSignificant main effect of Length for {dv}. No post-hoc needed for 2 levels.")
    else:
        print(f"\nNo significant main effects or interaction for {dv}. No post-hoc tests performed.")
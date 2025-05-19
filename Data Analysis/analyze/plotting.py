import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib import rcParams
import os

def generate_plots(df, output_dir='plots'):
    """
    Generates bar plots for each dependent variable, reaction time,
    and a combined Decision Quality metric.
    """
    print("\n--- Generating Plots ---") # Print message
    rcParams['font.family'] = 'Times New Roman'
    
    # Dependent variables to plot individually
    dv_order_plot_individual = ['accuracy', 'comprehension', 'confidence', 'satisfaction', 'effort', 'general_quality', 'subjective_quality', 'objective_quality', 'reaction_time']
    
    source_order = ['original', 'ai', 'programmatic']
    length_order = ['longer', 'shorter']
    custom_palette = [(0/255, 0/255, 128/255), (156/255, 97/255, 20/255)] # Navy and Sienna (Lund University color schema)

    source_display_labels = ['AI' if s == 'ai' else s.capitalize() for s in source_order]
    length_display_labels = [l.capitalize() for l in length_order]

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    else:
        print(f"Saving plots to existing directory: {output_dir}")

    # --- Generate DV Plots ---
    print("\n--- Generating Dependent Variable Plots ---")
    
    for dv_plot in dv_order_plot_individual:
        fig, ax = plt.subplots(figsize=(8, 6))
        plot_data = pd.DataFrame()
        y_column = None
        y_label = ''
        plot_title_dv = ''
        filename_dv = dv_plot

        if dv_plot == 'accuracy':
            # Ensure only the 'accuracy' question rows are selected
            plot_data = df[df['question'] == 'accuracy'].copy()
            y_column = 'response_value' 
            y_label = 'Proportion Correct (Accuracy)'
            plot_title_dv = 'Accuracy'
        elif dv_plot in ['confidence', 'comprehension', 'satisfaction', 'effort', 'general_quality', 'objective_quality', 'subjective_quality']:
            plot_data = df[df['question'] == dv_plot].copy()
            y_column = 'response_value' # These are ratings on a scale
            y_label = f'Mean {dv_plot.replace("_", " ").title()} Rating'
            plot_title_dv = dv_plot.replace("_", " ").title()
        elif dv_plot == 'reaction_time':
            # Ensure only the 'accuracy' question rows are selected
            plot_data = df[df['question'] == 'reaction_time'].copy()
            y_column = 'response_value'
            y_label = 'Average Reaction Time (ms)'
            plot_title_dv = 'Reaction Time'
        else:
            print(f"Skipping plotting for unknown DV: {dv_plot}")
            plt.close(fig)
            continue # Skip to the next iteration

        # Check if necessary columns exist before plotting
        required_cols = [y_column, 'source', 'length']
        if not plot_data.empty and all(col in plot_data.columns for col in required_cols):
            print(f"Generating plot for: {plot_title_dv}")
            sns.barplot(data=plot_data, x='source', y=y_column, hue='length', errorbar='se', capsize=0.1,
                        order=source_order, hue_order=length_order, palette=custom_palette, ax=ax)
            
            ax.set_title(f'Mean {plot_title_dv} by Source and Length')
            ax.set_xlabel('Microcontent Source')
            ax.set_ylabel(y_label)
            
            # Capitalize source labels on x-axis
            ax.set_xticklabels(source_display_labels)
            
            # Modify the legend call
            handles, labels = ax.get_legend_handles_labels()
            new_labels = [length_display_labels[length_order.index(label)] for label in labels]

            ax.legend(handles, new_labels, title='Length') # Use the new_labels here
            ax.grid(axis='y', linestyle='--', alpha=0.7)
            plt.tight_layout()
            filename = os.path.join(output_dir, f'{filename_dv}_barplot.png')
            plt.savefig(filename, dpi=300)
            print(f"Saved plot to: {filename}")
            plt.close(fig) # Close plot to free memory
        else:
            print(f"Skipping plot for {plot_title_dv} due to missing data or columns.")
            plt.close(fig)
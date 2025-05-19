# main.py

# Import the function from the process_data.py file
from evaluate import evaluate_data
from wrangle import wrangle_data
from analyze.main import analyze_data

# Call the function to run the data processing logic

if __name__ == "__main__":
    print("Wrangling data...")
    wrangle_data()
    print("Data wrangling finished.")
    print("Evaluating data...")
    evaluate_data()
    print("Data evaluation finished.")
    print("Analyzing data...")
    analyze_data()
    print("Data analysis finished.")
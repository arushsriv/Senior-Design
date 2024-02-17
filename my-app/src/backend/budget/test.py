import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np

transactions = pd.read_csv("./2024-02-14_transaction_download.csv")
transactions = transactions.rename(columns={'Transaction Date': 'transaction_date'})

category_counts = transactions['Category'].value_counts()


def filter_and_count_categories(transactions, desired_month):
    transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])
    transactions['month'] = transactions['transaction_date'].dt.to_period('M')

    filtered_df = transactions[transactions['month'] == desired_month]

    category_counts = filtered_df['Category'].value_counts()

    return category_counts


def predict_spending(transactions, desired_month):

    transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

    transactions['month'] = transactions['transaction_date'].dt.to_period('M')

    monthly_spending = transactions[transactions['month'] == desired_month].groupby('Category')['Debit'].sum().reset_index()

    # Train a linear regression model for each category
    models = {}
    for category in monthly_spending['Category']:
        category_data = transactions[transactions['Category'] == category].groupby('month')['Debit'].sum().reset_index()
        X = category_data['month'].dt.month.astype(float).values.reshape(-1, 1)
        y = category_data['Debit'].values
        model = LinearRegression()
        model.fit(X, y)
        models[category] = model

    # Make predictions for the desired month
    predictions = {}
    for category, model in models.items():
        X_desired = np.array([pd.to_datetime(desired_month).month]).reshape(1, -1)
        predictions[category] = model.predict(X_desired)

    # Display predicted spending for the desired month
    print(f"\nPredicted Spending for {desired_month}:")
    for category, prediction in predictions.items():
        print(f"{category}: {prediction[0]:.2f}")


def predict_spending_with_budget(transactions, desired_month, overall_budget, scaling_factor=0.8):
    # Convert 'transaction_date' to datetime format
    transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

    # Extract month and year
    transactions['month'] = transactions['transaction_date'].dt.to_period('M')

    # Filter data for the desired month
    monthly_spending = transactions[transactions['month'] == desired_month].groupby('Category')['Debit'].sum().reset_index()

    # Train a linear regression model for each category
    models = {}
    for category in monthly_spending['Category']:
        category_data = transactions[transactions['Category'] == category].groupby('month')['Debit'].sum().reset_index()
        X = category_data['month'].dt.month.astype(float).values.reshape(-1, 1)
        y = category_data['Debit'].values / overall_budget  # Normalize to percentage of overall budget
        model = LinearRegression()
        model.fit(X, y)
        models[category] = model

    # Make predictions for the desired month with the scaling factor
    predictions = {}
    for category, model in models.items():
        X_desired = np.array([pd.to_datetime(desired_month).month]).reshape(1, -1)
        predicted_percentage = model.predict(X_desired)
        scaled_prediction = max(predicted_percentage * scaling_factor, 0.0)  # Set a minimum value of 0
        predictions[category] = scaled_prediction * overall_budget  # Convert back to actual spending

    print(f"\nPredicted Spending for {desired_month} (Based on Overall Budget for the next month:")
    for category, prediction in predictions.items():
        print(f"{category}: {float(prediction):.2f}")


def get_top5_amounts_per_category_item(transactions, desired_month):
    transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

    # Extract month and year
    transactions['month'] = transactions['transaction_date'].dt.to_period('M')

    # Filter data for the desired month
    monthly_data = transactions[transactions['month'] == desired_month]

    # Group by category and item, and get the top 5 amounts for each category and item
    top5_per_category_item = (
        monthly_data.groupby(['Category', 'Description'], as_index=False)
        .apply(lambda x: x.nlargest(5, 'Debit'))
        .reset_index(drop=True)
    )

    return top5_per_category_item

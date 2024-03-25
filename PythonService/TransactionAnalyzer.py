import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np
import json
from collections import defaultdict


class TransactionAnalyzer:
    def __init__(self, transactions):
            self.transactions = transactions

    def budget_breakdown(self):
        # Dictionary to store monthly categorized spending
            monthly_spending = defaultdict(lambda: defaultdict(float))
            
            for transaction in self.transactions:
                month = transaction['transaction_date'].split('-')[1]
                category = transaction['Category']
                amount = transaction['Debit']
                #RiaK if amount has string it will produce error fixed by converting it to int
                if amount != '':
                    monthly_spending[month][category] += amount

            # Calculate total spending per month
            monthly_totals = {month: sum(categories.values()) for month, categories in monthly_spending.items()}

            # Calculate percentage spending per category per month
            monthly_percentage_spending = {month: {category: round((amount / monthly_totals[month]) * 100,2)
                                                for category, amount in categories.items()}
                                        for month, categories in monthly_spending.items()}
            
            return monthly_percentage_spending





    def filter_and_count_categories(self, desired_month):
        self.transactions['transactionDate'] = pd.to_datetime(self.transactions['transactionDate'])
        self.transactions['month'] = self.transactions['transactionDate'].dt.to_period('M')

        filtered_df = self.transactions[self.transactions['month'] == desired_month]

        category_counts = filtered_df['Category'].value_counts()

        return category_counts

    # METHOD WORKS DO NOT CHANGE
    def predict_spending(self, desired_month):
        
        df = pd.DataFrame(self.transactions)
        filtered_transactions = df[(df['month'] == desired_month)]
        monthly_spending = filtered_transactions.groupby('Category')['Debit'].sum().reset_index()
        models = {}
        for category in monthly_spending['Category']:
            category_data = df[df['Category'] == category].groupby('month')['Debit'].sum().reset_index()
            category_data['month'] = pd.to_datetime(category_data['month'])
            X = category_data['month'].dt.month.astype(float).values.reshape(-1, 1)
            y = category_data['Debit'].values
            model = LinearRegression()
            model.fit(X, y)
            models[category] = model

        predictions = {}
        for category, model in models.items():
            X_desired = np.array([pd.to_datetime(desired_month).month]).reshape(1, -1)
            predictions[category] = model.predict(X_desired)

        print(f"\nPredicted Spending for {desired_month}:")
        json_data = {}
        for category, prediction in predictions.items():
            print(f"{category}: {prediction[0]:.2f}")
            json_data[category] = prediction[0]
            print(json_data)
        return json_data
    
    def predict_spending2(self, desired_month, overallBudget,
                          scaling_factor=0.8):
        df = pd.DataFrame(self.transactions)
        filtered_transactions = df[df['month'] == desired_month]
        monthly_spending = filtered_transactions.groupby('Category')['Debit'].sum().reset_index()
        models = {}
        for category in monthly_spending['Category']:
            category_data = df[df['Category'] == category].groupby('month')['Debit'].sum().reset_index()
            category_data['month'] = pd.to_datetime(category_data['month'])
            X = category_data['month'].dt.month.astype(float).values.reshape(-1, 1)
            y = category_data['Debit'].values / overallBudget
            model = LinearRegression()
            model.fit(X, y)
            models[category] = model

        predictions = {}
        for category, model in models.items():
            X_desired = np.array([pd.to_datetime(desired_month).month]).reshape(1, -1)
            predicted_percentage = model.predict(X_desired)
            scaled_prediction = max(predicted_percentage * scaling_factor, 0.0)
            predictions[category] = scaled_prediction * overallBudget

        print(f"\nPredicted Spending for {desired_month}:")
        json_data = {}
        for category, prediction in predictions.items():
            print(f"{category}: {prediction[0]:.2f}")
            json_data[category] = prediction[0]
            print(json_data)
        return json_data    

    def predict_spending_with_budget(self, desired_month, overall_budget, scaling_factor=0.8):
        self.transactions['transactionDate'] = pd.to_datetime(self.transactions['transactionDate'])
        self.transactions['month'] = self.transactions['transactionDate'].dt.to_period('M')

        monthly_spending = self.transactions[self.transactions['month'] == desired_month].groupby('Category')['Debit'].sum().reset_index()

        models = {}
        for category in monthly_spending['Category']:
            category_data = self.transactions[self.transactions['Category'] == category].groupby('month')['Debit'].sum().reset_index()
            X = category_data['month'].dt.month.astype(float).values.reshape(-1, 1)
            y = category_data['Debit'].values / overall_budget
            model = LinearRegression()
            model.fit(X, y)
            models[category] = model

        predictions = {}
        for category, model in models.items():
            X_desired = np.array([pd.to_datetime(desired_month).month]).reshape(1, -1)
            predicted_percentage = model.predict(X_desired)
            scaled_prediction = max(predicted_percentage * scaling_factor, 0.0)
            predictions[category] = scaled_prediction * overall_budget

        print(f"\nPredicted Spending for {desired_month} (Based on Overall Budget for the next month):")
        for category, prediction in predictions.items():
            print(f"{category}: {float(prediction):.2f}")

    def get_top5_amounts_per_category_item(self, desired_month):
        self.transactions['transactionDate'] = pd.to_datetime(self.transactions['transactionDate'])
        self.transactions['month'] = self.transactions['transactionDate'].dt.to_period('M')

        monthly_data = self.transactions[self.transactions['month'] == desired_month]

        top5_per_category_item = (
            monthly_data.groupby(['Category', 'Description'], as_index=False)
            .apply(lambda x: x.nlargest(5, 'Debit'))
            .reset_index(drop=True)
        )

        return top5_per_category_item

# Example usage:
# analyzer = TransactionAnalyzer("./2024-02-14_transaction_download.csv")
# desired_month = '2024-02'
# analyzer.predict_spending(desired_month)

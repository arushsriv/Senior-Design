from flask import Flask, jsonify, request
from pymongo import MongoClient
import csv
import datetime
from TransactionAnalyzer import TransactionAnalyzer

app = Flask(__name__)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['seniordesign24']
collection = db['transactions']

# Define schema
transaction_schema = {
    "transactionDate": datetime,
    "postedDate": datetime,
    "cardNumber": str,
    "description": str,
    "category": str,
    "debit": float,
    "credit": float
}

def read_transactions_for_user(user_id):
    transactions = list(collection.find({'user_id': user_id}))  # Retrieve transactions for the user
    # Convert date strings to datetime objects
    for transaction in transactions:
        transaction['transactionDate'] = datetime.datetime.strptime(transaction['transactionDate'], '%Y-%m-%d')
        transaction['postedDate'] = datetime.datetime.strptime(transaction['postedDate'], '%Y-%m-%d')
        transaction['month'] = transaction['transactionDate'].month

    
    return transactions

@app.route('/predict-spending', methods=['POST'])
def predict_spending_route():
    data = request.get_json()
    user_id = data.get('user_id')
    desired_month = data.get('desired_month')
    transactions = read_transactions_for_user(user_id)
    analyzer = TransactionAnalyzer(transactions)  # Assuming transactions is a DataFrame
    predicted_spending = analyzer.predict_spending(desired_month)
    return jsonify({'predicted_spending': predicted_spending}), 200


def read_csv_and_insert(filename, user_id):
    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            transaction = {
                'transactionDate': row['Transaction Date'].strip(),
                'postedDate': row['Posted Date'].strip(),
                'Card_No': row['Card No.'].strip(),
                'Description': row['Description'].strip(),
                'Category': row['Category'].strip(),
                'user_id': user_id  # Added user_id
            }

            debit_value = row['Debit'].strip()
            if debit_value.replace('.', '').isdigit():  # Check if the string contains a valid float
                transaction['Debit'] = float(debit_value)
            else:
                transaction['Debit'] = 0.0  # If not valid, set to 0.0

            # Validate and convert 'Credit' to float if valid
            credit_value = row['Credit'].strip()
            if credit_value.replace('.', '').isdigit():  # Check if the string contains a valid float
                transaction['Credit'] = float(credit_value)
            else:
                transaction['Credit'] = 0.0  # If not valid, set to 0.0
            filter_query = {
                'transactionDate': transaction['transactionDate'],
                'postedDate': transaction['postedDate'],
                'Card_No': transaction['Card_No'],
                'Description': transaction['Description'],
                'Category': transaction['Category'],
                'Debit': transaction['Debit'],
                'Credit': transaction['Credit'],
                'user_id': user_id  # Added user_id
            }
            collection.update_one(filter_query, {'$set': transaction}, upsert=True)  # Upsert to update or insert


@app.route('/transactions/csv', methods=['POST'])
def create_transactions_from_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = file.filename
        if filename.endswith('.csv'):
            user_id = request.form.get('user_id')  # Added user_id
            file.save(filename)
            read_csv_and_insert(filename, user_id)  # Pass user_id to the function
            return jsonify({'message': 'Transactions created successfully from CSV'}), 201
        else:
            return jsonify({'error': 'Only CSV files are allowed'}), 400

if __name__ == '__main__':
    app.run(debug=True)

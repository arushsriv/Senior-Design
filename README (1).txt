1. Install Flask pip install Flask
2. Install pymongo : pip install pymongo 
3. Install scikit-learn : pip install -U scikit-learn
3. Run the python Service python app.py (it will run web service on http://localhost:5000)
4. Use this curl command to send file from local terminal to insert data into MongoDb, assumes the file in the current directory
    curl -X POST -F "file=@transactions.csv" -F "user_id=riakul" http://localhost:5000/transactions/csv

5. Web Service  
    http://localhost:5000/predict-spending 
    {
    "user_id":"riakul",
    "desired_month": 12
}

pyenv install 3.12.1
Go to VSStudio and select the environment in the bottom bar
    $ python3 -m venv env
    $ source env/bin/activate
Install all libraries
    pip install --upgrade pip
    pip install requests numpy matplotlib flask scikit-learn pymongo
    

pyenv install 3.12.1

Before you start the execution use this command
source env/bin/activate


/usr/bin/env /Users/mkulkarn/projects/training/Ria/ria-senior-design/pythonai/env/bin/python -- /Users/mkulkarn/projects/training/Ria/ria-senior-design/pythonai/app.py
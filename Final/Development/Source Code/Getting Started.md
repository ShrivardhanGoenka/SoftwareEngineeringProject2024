# Getting Started 

This is a manual explaining how to replicate the code on a local machine. 

## Prerequisites
- Python 3.10 or higher
- Pip
- Node.js 14.0 or higher

## Backend

The backend is a Django application that uses Django Rest Framework to create a REST API. We are also using PostgreSQL as the database. The database is hosted on remotely on Aiven. The credentials have been entered in the settings.py file so psql is not required to be installed on the local machine.

1. Navigate to the backend folder
```bash
cd SWEBackend
```

2. Install the required packages
Windows:
```bash
pip install -r requirements.txt
```
MacOS/Linux:
```bash
pip3 install -r requirements.txt
```

3. Run the server
Windows:
```bash
python manage.py runserver
```

MacOS/Linux:
```bash
python3 manage.py runserver
```

The server should now be running on http://localhost:8000/. You can test it by navigating to http://localhost:8000/ in your browser. You should see a page that says "Not Found on Django urls.py". This is expected as the Django application does not have a frontend.

Note: The backend is hosted on AWS EC2. 

## Frontend

The frontend is a React application that uses fetch to make requests to the backend. 

1. Navigate to the frontend folder
```bash
cd SWEFrontend
```

2. Install the required packages
```bash
npm install
```

3. Run the server
```bash
npm start
```

The server should now be running on http://localhost:3000/. You can test it by navigating to http://localhost:3000/ in your browser. You should see the SmartXplorers homepage.
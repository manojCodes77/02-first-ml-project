import os
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

application = Flask(__name__)
app = application

# Explicit CORS setup for React client
CORS(app)

# Secret key for JWT
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_default_secret_key')

# Create a connection pool using environment variables
db_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,  # Min and max connections in the pool
    dbname=os.getenv('PGDATABASE', 'your_default_dbname'),
    user=os.getenv('PGUSER', 'your_default_user'),
    password=os.getenv('PGPASSWORD', 'your_default_password'),
    host=os.getenv('PGHOST', 'your_default_host'),
    port=os.getenv('PGPORT', '5432')  # Default PostgreSQL port
)

if db_pool:
    print("Connection pool created successfully!")

# Import ridge regressor model and standard scaler pickle
ridge_model = pickle.load(open('models/ridge.pkl', 'rb'))
standard_scaler = pickle.load(open('models/scaler.pkl', 'rb'))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        print(f"Received Token: {token}")  # Debugging
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_email = data['email']
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user_email, *args, **kwargs)
    return decorated

# Route for home page
@app.route('/',methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the Flask API!'})

@app.route('/predictdata', methods=['POST'])
@token_required
def predict_datapoint(current_user_email):
    conn = None
    try:
        conn = db_pool.getconn()  # Get a connection from the pool
        if request.content_type == 'application/json':
            data = request.json
            try:
                Temperature = float(data.get('Temperature'))
                RH = float(data.get('RH'))
                Ws = float(data.get('Ws'))
                Rain = float(data.get('Rain'))
                FFMC = float(data.get('FFMC'))
                DMC = float(data.get('DMC'))
                ISI = float(data.get('ISI'))
                Classes = float(data.get('Classes'))
                Region = float(data.get('Region'))

                new_data_scaled = standard_scaler.transform([[Temperature, RH, Ws, Rain, FFMC, DMC, ISI, Classes, Region]])
                result = ridge_model.predict(new_data_scaled)

                # Return JSON response for API calls
                return jsonify({'result': float(result[0])})
            except Exception as e:
                return jsonify({'error': str(e)}), 400
        else:
            return jsonify({'error': 'Invalid content type, expected application/json'}), 400
    finally:
        if conn:
            db_pool.putconn(conn)  # Return the connection to the pool

# Route for user signup
@app.route('/signup', methods=['POST'])
def signup():
    conn = None
    try:
        conn = db_pool.getconn()  # Get a connection from the pool
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            return jsonify({'error': 'Username, password, and email are required'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create a new cursor for this request
        with conn.cursor() as cursor:
            # Insert user into the database
            cursor.execute(
                "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)",
                (username, hashed_password, email)
            )
            conn.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()  # Rollback the transaction in case of an error
        if 'unique constraint' in str(e):
            return jsonify({'error': 'Email already exists'}), 400
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)  # Return the connection to the pool

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    conn = None
    try:
        conn = db_pool.getconn()  # Get a connection from the pool
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'email and password are required'}), 400

        # Create a new cursor for this request
        with conn.cursor() as cursor:
            # Fetch user from the database
            cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

        if user and check_password_hash(user[0], password):
            # Generate JWT token
            token = jwt.encode({
                'email': email,
                'exp': datetime.datetime.now() + datetime.timedelta(hours=2)
            }, app.config['SECRET_KEY'], algorithm="HS256")

            return jsonify({'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            db_pool.putconn(conn)  # Return the connection to the pool

if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0")

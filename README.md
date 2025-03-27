# Algerian Fire Weather Index (FWI) Prediction System

A full-stack web application for predicting the Fire Weather Index in Algeria based on meteorological data.

## Project Overview

This application uses machine learning to predict the Fire Weather Index (FWI) based on various weather parameters. It consists of a Flask backend API with a machine learning model (Ridge Regression) and a Next.js frontend interface.

## Features

- User authentication (signup and login)
- JWT-based authentication for API access
- Input form for weather parameters
- Real-time FWI prediction
- Modern, responsive UI using Tailwind CSS

## Tech Stack

### Backend
- Flask
- PostgreSQL (hosted on Neon)
- Scikit-learn (Ridge Regression model)
- JWT for authentication
- Flask-CORS for cross-origin requests

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- JWT for token management

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- PostgreSQL database (or use the provided Neon DB)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv ../algerian_venv
   # Windows
   ..\algerian_venv\Scripts\activate
   # Linux/Mac
   source ../algerian_venv/bin/activate
   ```

3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables in a `.env` file (example provided in the repo)

5. Run the server:
   ```
   python run_server.py
   ```
   The server will start at http://localhost:8080

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in `.env` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Usage

1. Register a new account on the signup page
2. Login with your credentials
3. Enter the required weather parameters:
   - Temperature
   - RH (Relative Humidity)
   - Ws (Wind Speed)
   - Rain
   - FFMC (Fine Fuel Moisture Code)
   - DMC (Duff Moisture Code)
   - ISI (Initial Spread Index)
   - Classes
   - Region
4. Click "Predict" to get the Fire Weather Index prediction

## Project Structure

```
├── server/                # Flask backend
│   ├── application.py     # Main application file
│   ├── run_server.py      # Server startup script
│   ├── requirements.txt   # Python dependencies
│   ├── models/            # ML models
│   ├── dataset/           # Training data
│   └── notebooks/         # Jupyter notebooks for model development
│
├── client/                # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── page.jsx       # Home page
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   └── predictdata/   # Prediction form page
│   ├── components/        # Reusable React components
│   └── package.json       # JavaScript dependencies
│
└── algerian_venv/         # Python virtual environment
```

## Deployment

- The backend can be deployed to a service like Heroku, Render, or AWS.
- The frontend can be deployed to Vercel, Netlify, or any static hosting service.
- Update the `.env` files to reflect the deployment URLs.

## License

This project is licensed under the MIT License. 
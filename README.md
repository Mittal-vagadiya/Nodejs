## Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Install dependencies:
   Nodejs version : 14.20.1

4. Set up environment variables:

Create a `.env` file in the root directory and provide the following variables:

CONNECTION_STRING = your_database_connection_string
PORT = your_port
JWT_SECRET = your_jwt_secret
TWILIO_ACCOUNT_SID = your_twilio_account_sid
TWILIO_AUTH_TOKEN = "your_twilio_auth_token"
TWILIO_PHONE_NUMBER = +your_twilio_phone_number

5. Start the application


This project implements an API for sending OTP (One-Time Password) messages using Twilio's SMS service. It is built with Node.js and MongoDB as the database. The API allows users to request and send OTPs to mobile numbers, enabling secure authentication and verification processes. Features include generating random OTPs, setting OTP expiration time, and integrating with Twilio's messaging service for SMS delivery. The project utilizes the Mongoose library for MongoDB database interactions and provides error handling and response formatting using the Express.js framework.
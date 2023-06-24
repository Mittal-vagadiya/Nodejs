# Nodejs
This project is a Node.js API with MongoDB for sending OTPs via Twilio's SMS service. It enables secure authentication using random OTP generation, expiration time, and Twilio integration. Built with Mongoose and Express.js for efficient database operations and error handling.

## Installation

1. Clone the repository.

2. Navigate to the project directory.

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

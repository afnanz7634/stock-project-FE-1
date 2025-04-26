# Stock Index Tracker

A web application for tracking stock index values with real-time alerts.

## Features

- User authentication with Firebase
- Stock indices overview
- Interactive charts for index values
- Price threshold alerts with email notifications
- API usage statistics

## Tech Stack

- **Frontend**: Next.js
- **Backend**: NestJS
- **Authentication**: Firebase Authentication
- **Stock Data**: Finnhub API
- **Email Notifications**: SMTP (Gmail)
- **Hosting**: Firebase App Hosting

## Project Structure

```
stock-project/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
└── firebase/          # Firebase configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Finnhub API key
- Gmail account (for SMTP)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Configure Firebase credentials
   - Add Finnhub API key
   - Set up SMTP credentials

4. Start development servers:
   ```bash
   # Start frontend
   cd frontend
   npm run dev

   # Start backend
   cd ../backend
   npm run start:dev
   ```

## Deployment

The application can be deployed to Firebase App Hosting. See deployment instructions in the respective directories.

## License

This project is licensed under the MIT License.
 

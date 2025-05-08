# Smart Task Prioritization System

A full-stack application that helps users manage and prioritize tasks using AI-powered prioritization. The system includes user authentication, task management, and email notifications.

## Features

- 🔐 User Authentication (Register, Login, Logout)
- 📝 Task Management (Create, Read, Update, Delete)
- 🤖 AI-Powered Task Prioritization
- 👥 User Assignment
- 📧 Email Notifications
- 📊 Task Analytics
- 🎨 Modern UI with Responsive Design

## Tech Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- FastAPI (AI Service)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB
- Python 3.8+ (for AI service)
- Git

## Project Structure

```
smart-task-prioritization-system/
├── client/                 # Frontend (Next.js)
│   ├── app/               # Next.js app directory
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── backend/               # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── views/         # Email templates
└── ai_service/            # AI Service (FastAPI)
    └── src/
        ├── api/           # FastAPI endpoints
        └── services/      # AI services
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-task-prioritization-system.git
cd smart-task-prioritization-system
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=8001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/task-prioritization

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=your_email@gmail.com

# Client URL
CLIENT_URL=http://localhost:3000

# AI Service Configuration
AI_AGENT_PORT=8000
```

4. Start MongoDB:
```bash
sudo systemctl start mongodb
```

5. Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### 4. AI Service Setup

1. Navigate to the AI service directory:
```bash
cd ai_service
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the AI service:
```bash
python src/api/main.py
```

## Running the Application

1. Ensure all three services are running:
   - Backend (http://localhost:8001)
   - Frontend (http://localhost:3000)
   - AI Service (http://localhost:8000)

2. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Authentication
- POST `/api/v1/register` - Register a new user
- POST `/api/v1/login` - Login user
- GET `/api/v1/logout` - Logout user
- GET `/api/v1/user` - Get user details

### Tasks
- POST `/api/v1/task/create` - Create a new task
- GET `/api/v1/tasks` - Get all tasks
- PATCH `/api/v1/task/:id` - Update a task
- DELETE `/api/v1/task/:id` - Delete a task

### AI Service
- POST `/prioritize-task` - Get AI priority for a task
- POST `/prioritize-tasks` - Get AI priorities for multiple tasks

## Email Configuration

To enable email notifications:

1. Set up a Gmail account for sending emails
2. Enable 2-Step Verification in your Google Account
3. Generate an App Password:
   - Go to Google Account settings
   - Security
   - 2-Step Verification
   - App passwords
   - Generate a new app password for "Mail"
4. Update the `.env` file with your Gmail credentials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email ms24901994@my.sliit.lk ms24900690@my.sliit.lk ms24912402@my.sliit.lk ms24900904@my.sliit.lk or open an issue in the repository.

#!/bin/bash

echo "Starting the Smart Task Prioritization System setup..."

# Step 1: Clone the Repository
if [ ! -d "smart-task-prioritization-system" ]; then
  echo "Cloning the repository..."
  git clone https://github.com/isuruisuru/smart-task-prioritization-system.git
  cd smart-task-prioritization-system || exit
else
  echo "Repository already cloned. Proceeding..."
  cd smart-task-prioritization-system || exit
fi

# Step 2: Backend Setup
echo "Setting up the Backend..."
cd backend || exit

# Install Node.js dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
else
  echo "Backend dependencies already installed."
fi

# Create .env file
echo "Creating .env file for the backend..."
cat > .env <<EOL
PORT=8001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/task-prioritization
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=your_email@gmail.com
CLIENT_URL=http://localhost:3000
AI_AGENT_PORT=8000
EOL

# Start MongoDB
echo "Starting MongoDB service..."
sudo systemctl start mongodb

# Start Backend Server
echo "Starting the backend server..."
npm run dev &

cd ..

# Step 3: Frontend Setup
echo "Setting up the Frontend..."
cd client || exit

# Install Node.js dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
else
  echo "Frontend dependencies already installed."
fi

# Start Frontend Server
echo "Starting the frontend server..."
npm run dev &

cd ..

# Step 4: AI Service Setup
echo "Setting up the AI Service..."
cd ai_service || exit

# Create Python virtual environment and install dependencies
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
  source venv/bin/activate
  echo "Installing AI service dependencies..."
  pip install -r requirements.txt
else
  echo "Virtual environment already exists. Activating..."
  source venv/bin/activate
fi

# Start AI Service
echo "Starting the AI service..."
uvicorn src.api.main:app --reload &

cd ..

echo "Setup complete! Access the application at http://localhost:3000"
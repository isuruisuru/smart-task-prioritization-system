# Automated Build Script for Smart Task Prioritization System

This repository includes an automated build script (`build.sh`) to simplify the setup and execution of the **Smart Task Prioritization System**. The script replaces the manual setup process outlined in the main README file, automating the installation of dependencies and starting all necessary services.

## Prerequisites

Before running the script, ensure the following software is installed on your system:
- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **MongoDB** (installed and configured)
- **Git** (for cloning the repository)

## Script Overview

The `build.sh` script performs the following steps:
1. Clones the repository (if not already cloned).
2. Sets up the backend:
   - Installs dependencies.
   - Creates a `.env` file with default values (customizable).
   - Starts the MongoDB service and the backend server.
3. Sets up the frontend:
   - Installs dependencies.
   - Starts the development server.
4. Sets up the AI service:
   - Creates a Python virtual environment.
   - Installs dependencies.
   - Starts the AI service.

## Instructions

### Step 1: Download the Script
Save the script below as `build.sh` in your desired directory.

```bash name=build.sh
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
python src/api/main.py &

cd ..

echo "Setup complete! Access the application at http://localhost:3000"
```

### Step 2: Make the Script Executable
Run the following command to give the script execution permissions:
```bash
chmod +x build.sh
```

### Step 3: Execute the Script
Run the script with the following command:
```bash
./build.sh
```

## Notes
- **MongoDB**: Ensure MongoDB is installed and running on your machine before executing the script.
- **Environment Variables**: Update the `.env` file created by the script with your own values (e.g., email credentials, JWT secret).
- **Services**: The script starts all services (backend, frontend, and AI service) in the background.
- **Stopping Services**: To stop any service, you can manually kill the corresponding process.

### Troubleshooting
- If you encounter any issues during the setup, ensure all prerequisites are installed and configured correctly.
- For support, open an issue in the repository or contact the maintainers.

Enjoy using the Smart Task Prioritization System with ease!

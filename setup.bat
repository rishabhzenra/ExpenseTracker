@echo off
title Savora - Setup
color 0A
echo.
echo  ========================================
echo   SAVORA Finance Platform - Auto Setup
echo  ========================================
echo.

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed!
    echo  Please install from https://nodejs.org and run this again.
    pause
    exit
)
echo  [OK] Node.js found

REM Clone repos if not already present
if not exist "ExpenseTracker" (
    echo  [1/5] Cloning backend...
    git clone https://github.com/rishabhzenra/ExpenseTracker.git
) else (
    echo  [1/5] Backend folder exists, pulling latest...
    cd ExpenseTracker && git pull && cd ..
)

if not exist "ExpenseFront" (
    echo  [2/5] Cloning frontend...
    git clone https://github.com/rishabhzenra/ExpenseFront.git
) else (
    echo  [2/5] Frontend folder exists, pulling latest...
    cd ExpenseFront && git pull && cd ..
)

REM Create backend .env
echo  [3/5] Setting up backend config...
(
echo DATABASE_URL=postgresql://neondb_owner:npg_EORqxJYn49Bz@ep-winter-sun-a1hpqmi9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
echo JWT_SECRET=your_super_secret_jwt_key_change_this
echo NODE_ENV=development
echo FRONTEND_URL=http://localhost:3000
echo PORT=4000
) > ExpenseTracker\backend\.env

REM Create frontend .env.local
echo  [4/5] Setting up frontend config...
(
echo NEXT_PUBLIC_API_URL=http://localhost:4000
) > ExpenseFront\.env.local

REM Install dependencies
echo  [5/5] Installing dependencies (this takes 5-7 mins)...
cd ExpenseTracker\backend && npm install && npm run build && cd ..\..
cd ExpenseFront && npm install && cd ..

echo.
echo  ========================================
echo   Setup Complete! Starting app...
echo  ========================================
echo.

REM Start backend in new window
start "Savora Backend" cmd /k "cd ExpenseTracker\backend && node dist/main"

REM Wait 3 seconds then start frontend
timeout /t 3 /nobreak >nul
start "Savora Frontend" cmd /k "cd ExpenseFront && npm run dev"

echo  Backend running at: http://localhost:4000
echo  Frontend running at: http://localhost:3000
echo.
echo  Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  Login with: demo@savora.in / demo1234
echo.
pause

@echo off
echo Preparing for Vercel deployment...

echo Checking for Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Vercel CLI not found. Installing...
  npm install -g vercel
) else (
  echo Vercel CLI already installed.
)

echo Installing dependencies in frontend...
cd frontend
call npm install
echo Building frontend...
call npm run build
cd ..

echo Installing dependencies in backend...
cd backend
call npm install
cd ..

echo Ready to deploy!
echo Run the following command to deploy:
echo vercel 
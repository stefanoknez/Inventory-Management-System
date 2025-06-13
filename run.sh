#!/bin/bash

echo "🔧 Starting backend..."
cd backend
npm install
npm start &
BACKEND_PID=$!

cd ../frontend
echo "🎨 Starting frontend..."
npm install
npm start &

wait $BACKEND_PID
#!/bin/sh

# Chờ database khởi động hoàn tất
echo "Waiting for PostgreSQL..."
sleep 5

# Khởi động ứng dụng
echo "Starting application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
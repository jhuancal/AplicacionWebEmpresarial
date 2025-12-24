FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if required (e.g. for mysqlclient)
# RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory content into the container's /app directory
COPY app/ .
COPY db/ /app/db/

# Ensure the static resources and templates are in the right place relative to main.py
# Since we copied contents of 'app/' to '/app/', main.py is at /app/main.py

CMD ["python", "main.py"]

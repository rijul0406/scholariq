# Recipe to build the backend image.

# Start from an official slim Python image (small, has Python preinstalled).
FROM python:3.13-slim

# Where our code lives inside the container.
WORKDIR /app

# Copy requirements FIRST (before the rest of the code). Docker caches each
# step; as long as requirements.txt doesn't change, it reuses the installed
# layer and skips reinstalling on every code change. Big speedup.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the application code.
COPY . .

# Document the port the app listens on.
EXPOSE 8000

# Shell form so ${PORT} is expanded at runtime. Hosting platforms (Render, etc.)
# set PORT to tell the app which port to bind; locally it defaults to 8000.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

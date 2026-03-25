FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
# Cloud Run uses the PORT environment variable
ENV PORT=8080
CMD uvicorn app:app --host 0.0.0.0 --port $PORT
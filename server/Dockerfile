
FROM python:3.7-stretch

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENV PORT=8000
EXPOSE $PORT

CMD ["python", "app.py"]
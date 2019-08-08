FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get install -y default-jdk
RUN apt-get install -y python-pip python-dev build-essential
RUN pip install flask

COPY . /predictor
WORKDIR /predictor

CMD ["python", "app.py"]

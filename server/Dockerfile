FROM python:3.9-alpine

WORKDIR /opt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .

RUN pip install --no-cache -r requirements.txt

COPY . .

CMD ["python", "main.py"]

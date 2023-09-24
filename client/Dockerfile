FROM node:18-alpine as client-builder

WORKDIR /opt

COPY package*.json .
RUN npm install

COPY public public
COPY src src

FROM client-builder as dev
CMD npm start

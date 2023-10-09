FROM node:20-alpine as client-builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY public public
COPY src src
COPY jsconfig.json jsconfig.json

FROM client-builder as dev

ENV WDS_SOCKET_PORT=443

CMD ["npm", "start"]

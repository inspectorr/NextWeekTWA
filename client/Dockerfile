FROM node:20-slim as client-builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY public public
COPY src src

FROM client-builder as dev

ENV WDS_SOCKET_PORT=443

CMD ["npm", "start"]

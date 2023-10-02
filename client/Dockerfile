FROM node:20-alpine as client-builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY public public
COPY src src
COPY config-overrides.js config-overrides.js

FROM client-builder as dev

CMD ["npm", "start"]

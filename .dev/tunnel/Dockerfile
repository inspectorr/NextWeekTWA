FROM node:20-alpine as tunnel-builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY index.js .

CMD ["npm", "start"]

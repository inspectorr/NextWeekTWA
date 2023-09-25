FROM node:18-alpine as tunnel-builder

WORKDIR /opt

COPY package*.json .
RUN npm install

COPY index.js .

CMD ["npm", "start"]

FROM node:20-alpine as client-builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY public public
COPY src src
COPY jsconfig.json jsconfig.json

EXPOSE 3000

FROM client-builder as dev
ENV WDS_SOCKET_PORT=443
CMD ["npm", "start"]

FROM client-builder as prod
RUN npm run build

FROM nginx:1.25.0-alpine as prod-nginx
COPY --from=prod /app/build/ /usr/share/nginx/html/
COPY static.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

FROM node:11.10

WORKDIR app

COPY package.json .
RUN npm install

COPY . .

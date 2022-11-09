FROM node:16.18.0

WORKDIR /application

COPY package*.json ./

RUN npm install

COPY . .
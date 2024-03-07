# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST=0.0.0.0

RUN npm run build

CMD [ "npm", "run", "preview" ]

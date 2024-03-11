# syntax=docker/dockerfile:1

FROM node:20-alpine

ARG BUILD_MODE

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN if [ "$BUILD_MODE" = "development" ]; \
    then npm run build:dev; \
    else npm run build:prod; \
    fi

CMD [ "npm", "run", "preview" ]

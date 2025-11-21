FROM node:20.11.1-alpine3.18

RUN apk update
RUN apk add tzdata

WORKDIR /app

COPY package*.json .

RUN npm ci -f

COPY . .

RUN npm run build
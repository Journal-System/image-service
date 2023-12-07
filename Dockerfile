FROM node:21.1

WORKDIR /app

COPY . .

WORKDIR /app

RUN npm install --legacy-peer-deps

EXPOSE 8084

CMD ["npm", "start"]
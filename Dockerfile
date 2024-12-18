#Stasis discord bot
FROM node:22-slim
WORKDIR /stasis-discord-bot
COPY package*.json ./
RUN npm install
COPY . ./
ENTRYPOINT ["node", "index.js"]
FROM node:20-bullseye

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git watchman \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY package*.json ./
RUN npm install && npx expo install --fix
RUN npm install -g @expo/ngrok@^4.1.0

COPY . .

EXPOSE 19000 19001 19002 8081
CMD ["npx", "expo", "start", "--tunnel"]

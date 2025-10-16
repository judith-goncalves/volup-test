FROM node:20-bullseye 

WORKDIR /app 

RUN apt-get update \
    && apt-get install -y --no-install-recommends git watchman \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


COPY package*.json ./ 

RUN npm install 
RUN npm install -g @expo/ngrok@^4.1.0

COPY . . 

EXPOSE 8081 19000 19001 19002 

CMD ["npx", "expo", "start", "--tunnel"]





# FROM node:20-bullseye

# WORKDIR /app

# # Copia package.json y package-lock.json
# COPY package*.json ./

# # Instala dependencias
# RUN npm install

# # Copia todo el proyecto
# COPY . .

# # Expone los puertos de Expo
# EXPOSE 19000 19001 19002 8081
# CMD ["npx", "expo", "start"]

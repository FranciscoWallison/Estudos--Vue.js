FROM node:20-alpine

WORKDIR /usr/src/app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

# --host expõe o dev server para fora do container
CMD ["npm", "run", "dev", "--", "--host"]

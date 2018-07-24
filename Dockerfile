FROM node:8.11.3-jessie

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

ENV NODE_ENV=development

RUN apt-get update -y \
  && apt-get install apt-utils cmake libpng-dev -y

RUN mkdir /logs

RUN npm install \
  && npm rebuild node-sass \
  && npm run build

EXPOSE 3000

CMD ["./docker_assets/docker_entrypoint.sh"]

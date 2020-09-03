FROM node:12

RUN npm install -g serve

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package* /usr/src/app/
RUN npm ci --silent && npm cache clean --force
COPY . /usr/src/app
ENV NODE_ENV production
RUN npm run build

CMD [ "serve", "-s", "build", "-l", "8080" ]

EXPOSE 8080

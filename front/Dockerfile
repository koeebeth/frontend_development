FROM node:16.16.0

WORKDIR /front/src
COPY ./src /front/src

RUN npm install

EXPOSE 81

CMD ["node", "/front/src/app.js"]


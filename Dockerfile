FROM node:10

WORKDIR /usr/src
COPY ["package.json", "/usr/src"]

RUN npm install

EXPOSE 4001
CMD npm run dev

FROM node:12

WORKDIR /var/app

COPY package*.json ./
COPY node_modules/ ./node_modules/
COPY dist/ ./dist/

CMD [ "node", "dist/server.js" ]

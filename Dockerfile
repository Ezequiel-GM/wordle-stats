FROM node:16

COPY ./ ./

RUN npm install --production

RUN node deploy-commands.js

CMD node index.js
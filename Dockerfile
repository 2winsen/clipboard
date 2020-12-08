FROM node:12-slim

EXPOSE 3000
EXPOSE 3030

RUN npm i npm@latest -g

RUN mkdir /opt/node_app && chown node:node /opt/node_app

WORKDIR /opt/node_app
USER node
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

COPY --chown=node:node . .

CMD [ "npm", "start" ]

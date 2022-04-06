FROM node:lts-alpine
ENV NODE_ENV=production
ENV HTTP_PORT=8080
ENV CLIENT_ID=861c78ea087a43aebc67938d804008ed
ENV CLIENT_SECRET=79ded7f016e04bdd9f57b079f77355c4
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
RUN npm run build
CMD ["npm", "start"]

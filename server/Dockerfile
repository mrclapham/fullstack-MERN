FROM node:20-alpine3.17
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN yarn && yarn add typescript tsc ts-node
COPY ./ ./
RUN yarn build
EXPOSE 3000
CMD ["node", "dist/index.js"]
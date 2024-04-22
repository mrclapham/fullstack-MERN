FROM node:20-alpine3.17 as builder
WORKDIR /app
COPY package.json ./
RUN yarn
COPY ./ ./
RUN yarn build

FROM nginx:stable-alpine
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
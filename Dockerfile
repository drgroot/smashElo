FROM node:14-alpine AS builder
LABEL maintainer="ali@yusuf.email"


# Create slim app image
FROM node:14-alpine AS app
COPY . /

ENV NODE_ENV production
USER node
CMD ["npm","start","--unhandled-rejections=strict"]
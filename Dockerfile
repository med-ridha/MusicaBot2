FROM wodby/node:20

USER root
RUN apk update && apk add --no-cache python3
USER node
WORKDIR /app

COPY --chown=node:node package.json /app

COPY . /app

CMD ["npm", "start"]

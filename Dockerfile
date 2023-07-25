FROM node:20-alpine3.17

COPY ./front /front

WORKDIR /front

RUN ["npm", "i", "-g", "npm"]
RUN ["npm", "ci"]
RUN ["npx", "next", "telemetry", "disable"]

ENTRYPOINT ["npm"]
CMD ["run", "dev"]

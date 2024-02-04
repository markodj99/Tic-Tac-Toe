FROM node:20.11.0-alpine

WORKDIR /front

COPY package*.json ./

RUN npm i

RUN npm i -g serve

RUN apk --no-cache add xsel
#RUN sudo apt install xsel

COPY . .

ARG REACT_APP_API_ENDPOINT
ENV REACT_APP_API_ENDPOINT $REACT_APP_API_ENDPOINT

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "-n", "build"]
#CMD ["npm", "run", "dev"]
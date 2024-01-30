FROM node:20.11.0-alpine

WORKDIR /back

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

COPY package*.json ./

COPY . .

RUN npm i

RUN npm run build

EXPOSE 5000

##CMD ["/wait", "&&", "npm", "run", "start"]
#CMD ["npm", "run", "dev"]
CMD /wait && npm run start
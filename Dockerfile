FROM node:16

RUN apt-get update && apt-get install -y chromium
RUN apt-get install -y fonts-noto-cjk
RUN apt-get install -y build-essential python3
#RUN apk --no-cache add msttcorefonts-installer fontconfig && \
#    update-ms-fonts && \
#    fc-cache -f


WORKDIR /app

COPY . .

#COPY ./package.json .
#COPY ./package-lock.json .

RUN npm install && npm cache clean --force

EXPOSE 8005

CMD [ "npm", "start" ]

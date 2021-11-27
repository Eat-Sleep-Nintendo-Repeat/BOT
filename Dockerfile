FROM node:16.6.1

# Install Google Chromw
RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*s

ENV PUPPETEER_EXECUTABLE_PATH='/usr/bin/google-chrome'

# Timezone Stuff
RUN apt-get install -y tzdata
ENV TZ Europe/Berlin

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

#TAEFIK CONFIG
LABEL traefik.enable="true" \
      traefik.http.routers.esnr-bot.entrypoints="websecure" \
      traefik.http.routers.esnr-bot.rule="Host(`eat-sleep-nintendo-repeat.eu`) && PathPrefix(`/api/botuptime`)" \
      traefik.port="7811" \
      traefik.http.routers.esnr-bot.tls.certresolver="letsencrypt"

EXPOSE 7811

CMD [ "node", "index.js" ]

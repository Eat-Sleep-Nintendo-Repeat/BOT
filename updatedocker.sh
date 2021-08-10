docker build -t dustin/esnr-bot:v3 . 
docker rm --force  ESNR-BOT-v3
docker run -d --restart always --name ESNR-API-v3dustin/esnr-bot:v3

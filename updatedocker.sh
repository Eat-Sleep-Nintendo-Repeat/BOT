docker build -t dustin/esnr-bot:v3 . 
docker rm --force Eat-to-Sleep-Bot
docker run -d --restart always --name Eat-to-Sleep-Bot dustin/esnr-bot:v3


############### Dockerfile ##############
# Build ->
#   docker build . -t local/stock-price-consumer:latest
# Run ->
#   docker run -p 4001:4001 --name stock-price-consumer local/stock-price-consumer:latest
# Stop ->
#   docker stop stock-price-consumer
##########################################

FROM node:8.11.3-alpine
WORKDIR /usr/src/app

# docker build should not rerun npm install unless package.json changes
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/ 
COPY package.json .

# skip red stdout texts, do not install devDependencies
RUN npm install --loglevel warn --production

COPY . .

EXPOSE 4001

# node index.js instead of npm start to reduce number of processes
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
CMD [ "node", "index.js" ]
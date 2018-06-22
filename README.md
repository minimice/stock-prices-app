# stock-prices-app 📈
Real time streaming stock prices using the Intrinio SDK built using distributed architecture.

![Real time streaming! Awesome!](https://raw.githubusercontent.com/minimice/stock-prices-app/master/demo.gif)

Author: [Lim Chooi Guan](https://www.linkedin.com/in/cgl88/) (Team Cloud Lead @ Scania AB, Senior Software Engineer)

## Pre-requisites 🔥
* Docker account on dockerhub  
* Docker  
* [Node 8.11.3](https://nodejs.org/en/download/)
* A modern browser like Chrome
* An enjoyment of looking at stocks!

## Quick start 🍕
1. Clone this repo.  Contact [me](https://www.linkedin.com/in/cgl88/) to get an Intrinio account to work with live quotes, you will need this to update the Docker-compose file.
2. Update the Docker-compose file with credentials.
```
## Update the following two lines in the Docker-compose file ##
- INTRINIO_USER=YOUR_USER_HERE
- INTRINIO_PASSWORD=YOUR_PASSWORD_HERE
```
3. Run the following command from the root directory of the repo in your favourite terminal.
```
docker-compose up --build
```
4. The NYSE stock exchange opens at 9:30am (GMT-4) New York Time.  This is 2:30pm London time.  You will not get streaming quotes until then, but the application will still work.  Open up a new shell, and run
```
docker ps
```
You should now see 8 containers running.  These are
```
spy-stock-price-client
bx-stock-price-client
bx-stock-price-consumer
spy-stock-price-consumer
bx-stock-price-server
spy-stock-price-server
sqs
memcached
```
5. If the stock markets have open, you should get streaming quotes.  If not check that your Intrinio account details are correct, and then run the Docker-compose file again.  In your browser, navigate to
```
http://localhost:6001
```
to see the stock ticker symbol SPY.  Also navigate to
```
http://localhost:6002
```
to see the stock ticker symbol BX (Blackstone).

6. Enjoy watching streaming quotes 🎉 until the market closes which is 4pm New York Time (GMT-4).

7. Press Ctrl+C in the terminal to stop docker-compose when you're happy enough.

8. Run
```
docker-compose down
```
to clean up.

## Running the tests
1. Change directory to integration-tests in a terminal.

2. Run
```
npm install
```

3. In the same directory, run
```
npm run up
```
to start docker-compose for the integration tests.

4. After all the services have started, which should take a few seconds, open up a new terminal window.

5. Change directory to integration-tests.

6. Run
```
npm test
```
You should get a message saying
```
1 passing (1s)
```
7. If you are getting a connection error, then the services may not have finished starting.  Wait and try again.
8. When you are done, run
```
npm run down
```
to clean up.

## Architecture 🏛
The system is designed with durability (a fake SQS and a fake Elasticache using memcache), composability, high availability and real-time communication in mind.  The backend components are completely separate from the frontend and allows for interchangeability.
The backend comprises of a producer which sends (last price) stock quotes (provided by Intrinio) to an SQS.  Consumers pull off this queue and posts the latest last price of a specific stock to a cache (memcached).  Stock specific servers running socket.io (operating over the websockets protocol) monitors the cache continuously and posts updates to connected clients when the timestamp of the last stock quote has changed.  Each front end client connects to a stock specific server and displays it to the user via the browser.

## Fun facts 🍄🤪
I became an official contributor to the [Intrinio SDK](https://github.com/intrinio/intrinio-realtime-node-sdk/graphs/contributors) after making a change which allows clients to connect over a proxy.  I had to do this as it failed to work when I tried it in an office environment.

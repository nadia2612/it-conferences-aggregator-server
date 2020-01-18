# IT conferences aggregator

This is a server part of IT conferences aggregator.
A frontend part can be found [here]([https://github.com/nadia2612/it-conferences-aggregator-client](https://github.com/nadia2612/it-conferences-aggregator-client))

This application provides an API access to resources like conferences that are stored in a relational database. Conference information is collected using web scrapers from 3-rd party websites being formatted, unified and stored in the database.

For each conference the scraper tries to determine the GPS location using the Google Maps API for further presentation on the map.

User authentication and registration is implemented using **jsonwebtoken**.

Any conference can be exported as an **ICS** calendar event.

## Technologies used

This application is built using NodeJS and PosgreSQL, with the help of following libraries:

-   ExpressJs
-   Sequelize
-   Google Geolocation API
-   ICS
-   Puppeteer
-   Moment

##  Spinning up
To spin up a local version of this application please follow this steps: 

1.  Clone the project  
    `$ git clone git@github.com:nadia2612/it-conferences-aggregator-server.git`  
    `$ cd it-conferences-aggregator-server`
2.  Run `npm install`
3.  Launch a *Postgres database* using the following command:  
    `$ npm run startDB`
4.  Define **GOOGLE_API_KEY** environment variable using `export GOOGLE_API_KEY="Your key"` command . 
The key can be generated [here](https://developers.google.com/maps/documentation/geocoding/get-api-key)
6.  Start scraper with the following command: 
`$ npm run scrape`
It will fetch conferences from the 3-rd party websites and store them in the database.
7.  Start the server using `npm run start`.
8.  Your server is running!  

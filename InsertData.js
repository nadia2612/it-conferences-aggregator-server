const Conference = require("./conference/model");
const Location = require("./location/model");
const scraper = require("./scraper");

scraper()
  .then(async result => {
    for (const current of result) {
      const { location, ...conference } = current;
      const existingLocation = await Location.findOne({
        where: { city: location.city, country: location.country }
      });
      if (existingLocation) {
        conference.locationId = existingLocation.id;
      } else {
        const newLocation = await Location.create(location);
        conference.locationId = newLocation.id;
      }

      await Conference.create(conference);
    }
  })
  .catch(error => console.log(error));

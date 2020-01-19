const Conference = require("../conference/model");
const Location = require("../location/model");
const scraper = require("./alltechconferencesScraper");

const persist = async (current) => {
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

const scrapeAndInsert = async () => {
  for (let page = 1; page < 10; page++) {
    const result = await scraper(page);
    for (const current of result) {
      await persist(current);
    }
  }
}

scrapeAndInsert().catch(error => console.log(error));

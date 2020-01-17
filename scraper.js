// javascript:if(!window.jQuery||confirm('Overwrite\x20current\x20version?\x20v'+jQuery.fn.jquery))(function(d,s){s=d.createElement('script');s.src='https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.js';(d.head||d.documentElement).appendChild(s)})(document);

const puppeteer = require("puppeteer");
const moment = require("moment");

const getConferenceSummary = async browser => {
  const page = await browser.newPage();
  await page.goto("https://www.alltechconferences.com/");
  await page.addScriptTag({
    url: "https://code.jquery.com/jquery-3.2.1.min.js"
  });

  const summary = await page.evaluate(() => {
    return $("article")
      .map((index, el) => {
        const logo_url = $(el)
          .find(".listing_img > a > img")
          .attr("src");
        const titleElememnt = $(el).find("h2.entry-title > a");
        const name = titleElememnt.text();
        const detailsUrl = titleElememnt.attr("href");

        return { logo_url, name, detailsUrl };
      })
      .toArray();
  });
  return summary;
};

const getConferenceDetails = async (browser, detailsUrl) => {
  const detailsPage = await browser.newPage();
  await detailsPage.goto(detailsUrl);
  await detailsPage.addScriptTag({
    url: "https://code.jquery.com/jquery-3.2.1.min.js"
  });

  const details = await detailsPage.evaluate(() => {
    const start_date = $("#frontend_date_st_date").text();
    const end_date = $("#frontend_date_end_date").text();
    const link = $("#website").attr("href");
    const price = $(".event_custom.frontend_reg_fees")
      .text()
      .trim();
    const description = $(".entry-content .frontend-entry-content>p")
      .text()
      .trim();
    const locationString = $(
      ".listing_custom_field.event_custom_field >p>span:eq(0)"
    )
      .text()
      .trim();
    const [city, country] = locationString.split(",");

    return {
      start_date,
      end_date,
      link,
      price,
      description,
      location: { city, country: country.trim() }
    };
  });
  await detailsPage.close();
  return details;
};

const getCoordinates = async location => {
  const googleMapsClient = require("@google/maps").createClient({
    key: "key",
    Promise: Promise
  });

  const coordinates = googleMapsClient
    .geocode({ address: location })
    .asPromise()
    .then(response => {
      const coordinates = response.json.results;
      const { lat, lng } = coordinates[0].geometry.location;
      return { lat, lng };
    })
    .catch(err => {
      console.log(err);
    });
  return coordinates;
};

module.exports = async () => {
  const browser = await puppeteer.launch();
  const summary = await getConferenceSummary(browser);

  const result = await Promise.all(
    summary.map(async current => {
      const { detailsUrl, ...conference } = current;
      console.log(
        "Gattering additional information from " + current.detailsUrl
      );
      const details = await getConferenceDetails(browser, detailsUrl);
      const { city, country } = details.location;
      const coordinates = await getCoordinates(`${city}, ${country}`);

      const fullConference = {
        ...conference,
        ...details,
        start_date: moment(details.start_date, "DD/MM/YYYY").toDate(),
        end_date: moment(details.end_date, "DD/MM/YYYY").toDate(),
        location: { ...details.location, ...coordinates }
      };
      console.log(fullConference, "fullConference");
      return fullConference;
    })
  );

  await browser.close();
  return result;
};

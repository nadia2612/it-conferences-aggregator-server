// javascript:if(!window.jQuery||confirm('Overwrite\x20current\x20version?\x20v'+jQuery.fn.jquery))(function(d,s){s=d.createElement('script');s.src='https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.js';(d.head||d.documentElement).appendChild(s)})(document);

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.alltechconferences.com/");
  await page.addScriptTag({
    url: "https://code.jquery.com/jquery-3.2.1.min.js"
  });

  const summary = await page.evaluate(() => {
    return $("article:eq(6)")
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

  console.log("Labels:", summary);

  const result = await Promise.all(
    summary.map(async current => {
      console.log(
        "Gattering additional information from " + current.detailsUrl
      );
      const detailsPage = await browser.newPage();
      await detailsPage.goto(current.detailsUrl);
      await detailsPage.addScriptTag({
        url: "https://code.jquery.com/jquery-3.2.1.min.js"
      });
      const additionalData = await detailsPage.evaluate(() => {
        const srart_date = $("#frontend_date_st_date").text();
        const end_date = $("#frontend_date_end_date").text();
        const link = $("#website").attr("href");
        const price = $(".event_custom.frontend_reg_fees").text().split(" ")
        const description = $(".entry-content .frontend-entry-content>p").text();
        const locationStirng=$(".listing_custom_field.event_custom_field >p>span:eq(0)").text()
        const location=locationStirng.substring(21, locationStirng.length-21).split(",")
        return { srart_date, end_date, link, price, description,location };
        
      });
      await detailsPage.close();
      return { ...current, ...additionalData };
    })
  );

  console.log("result:", result);

  await browser.close();
})();




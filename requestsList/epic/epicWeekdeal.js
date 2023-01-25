import axios from "axios";
import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import paginateData from "../../paginateData/paginateData.js";
import { textCleaner } from "../../assets/textCleaner.js";

const epicWeekDeal = (req, res) => {
  return axios
    .get(
      `https://www.epicgames.com/store/en-US/browse?sortBy=releaseDate&sortDir=DESC&priceTier=tierDiscouted&count=5&start=0`
    )
    .then((response) => {
      const html = response.data;
      const base = `https://www.epicgames.com`;
      const specShop = [];
      const seen = new Set();
      const $ = cheerio.load(html);
      $(`a[href*="store"]` && `a[role="link"]`, html).each(function (index) {
        const master = $(this).children();
        const title = master.find("span").first().text();
        const url = $(this).attr("href");
        const price = master.find("span").last().text();
        const discount = master.find("span").children().eq(1).text();
        const old_priceer = master.find("span").children().eq(2).text();
        const old_price = textCleaner.removeAllLetters(old_priceer);
        const currency = textCleaner.removeAllNumbers(old_priceer);
        const image = master.find("div");
        const img = image.find("img").data("image");
        if (title !== "" && price === 'Free') {
          specShop.push({
            id: index,
            title,
            price,
            currency: currency === "NEWTOEPIC" ? '' : currency,
            discount: price === discount ? "" : discount,
            old_price,
            url: base + url,
            img,
            source: "Epic",
          });
        } else return;
      });
      if (specShop.length > 0) {
        const filtered = specShop.filter((el) => {
          const duplicate = seen.has(el.title);
          seen.add(el.title);
          return !duplicate;
        });
        let result = filtered.map((card, index) => {
          card.id = index;
          const idCounted = { ...card };
          return idCounted;
        });
        return res.json(paginateData(req, result));
      } else return message.errorMsg("", "Epic");
    })
    .catch((error) => console.log(error));
};

export default epicWeekDeal;

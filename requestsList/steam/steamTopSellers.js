import axios from "axios";
import * as cheerio from "cheerio";
import { message } from "../../assets/messages.js";
import paginateData from "../../paginateData/paginateData.js";


const steamTopSellers = (req, res) => {
  return axios
    .get(`https://store.steampowered.com/specials#p=0&tab=TopSellers`)
    .then((response) => {
      const html = response.data;
      const specShop = [];
      const HTMLTransform = html.toLowerCase();
      const $ = cheerio.load(HTMLTransform);
      $(`a[href*="https://store.steampowered.com/app/"]`, HTMLTransform).each(
        function (index) {
          const masterPrice = $(this).children().find("div");
          const rater = $(this).children().find("div");
          const title = $(this).children().eq(2).find("div").first().text();
          const tags = $(this).children().find("span").text();
          const discount = masterPrice.first().text();
          const old_price = rater.eq(2).text();
          const price = masterPrice.eq(3).text();
          const imgContener = $(this).children();
          const img = imgContener.find("img").attr("src");
          const url = $(this).attr("href");
          if (price !== "") {
            specShop.push({
              id: index,
              title,
              price,
              old_price: old_price === title || old_price == "" ? "" : old_price,
              discount,
              tags,
              img,
              url,
              source: "Steam",
            });
          } else return;
        }
      );
      if (specShop.length !== 0) {
        return res.json(paginateData(req, specShop));
      } else return message.errorMsg("", "Steam");
    })
    .catch((error) => console.log(error));
};

export default steamTopSellers;

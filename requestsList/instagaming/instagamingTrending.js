import axios from "axios";
import * as cheerio from 'cheerio';
import paginateData from "../../paginateData/paginateData.js";
import { message } from "../../assets/messages.js";
import { calculations } from "../../assets/calculations.js";

const instagamingTrending = async (req, res) => {
  const search = req.params.search;
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const curr = req.query.currency ? req.query.currency : '';
  const currency = curr.toUpperCase();
  return axios
    .get(`https://www.instant-gaming.com/en/search/?q=&currency=${currency}`)
    .then((response) => {
      const html = response.data;
      const specShop = [];
      const $ = cheerio.load(html);
      $(`a[href*="https://www.instant-gaming.com/en/"]`, html, currency, priceLimit).each(function (index) {
        const master = $(this).parents().eq(0);
        const title = master.find(".fallback").text();
        const price = master.find(".price").text();
        const currency_tag = price.replace(/\d+.\d+/g, '');
        const discount = master.find(".discount").text();
        const img = master.find("img").data("src");
        const url = master.find("a").attr("href");
        const priceComparer = price !== '' ? calculations.priceCompare(price, priceLimit) : '';
        const finalPrice = priceComparer[1];
        if (title !== "" && finalPrice !== null && price !== '') {
          specShop.push({
            id: index,
            title,
            price: finalPrice,
            currency_tag,
            discount,
            img,
            url,
            source: "Instant Gaming",
          });
        } else return;
      });
      if (specShop.length !== 0) {
        return res.json(paginateData(req, specShop));
      } else return message.errorMsg(search, "Instant Gaming");
    })
    .catch((error) => console.log(error));
};


export default instagamingTrending;

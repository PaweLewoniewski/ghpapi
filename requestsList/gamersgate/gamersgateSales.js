import axios from "axios";
import * as cheerio from "cheerio";
import paginateData from "../../paginateData/paginateData.js";
import { currSupport } from "../../assets/currencySupport.js";
import { message } from "../../assets/messages.js";
import { calculations } from "../../assets/calculations.js";

const gamersgateSales = async (req, res) => {
    const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  return axios
    .get(`https://www.gamersgate.com/offers/`)
    .then((response) => {
      const html = response.data;
      const base = "https://www.gamersgate.com";
      const specShop = [];
      const seen = new Set();
      const $ = cheerio.load(html);
      $(`a[href*="/product/"]`, html).each(function (index) {
        const master = $(this).parents().eq(2);
        const dubster = $(this).parents().find(".product--item");
        const currency = dubster.data("currency");
        const currency_tag = currSupport.tagCurrency(currency);
        const title = master.find("a").text();
        const vendor_name = dubster.data("vendor_name");
        const old_price = master.find("span").next().text();
        const price = master.find("span").eq(0).text();
        const url = master.find("a").attr("href");
        const img = master.find("img").attr("src");
        const discount = master.find(".product--label-discount").first().text();
        const product = master.find(".product--label-preorder").text();
        const priceComparer =price !== "free"? calculations.priceCompare(price, priceLimit): "";
        const finalPrice = priceComparer[1];
        if (title !== "") {
          specShop.push({
            id: index,
            title,
            price: finalPrice,
            currency,
            currency_tag,
            old_price,
            discount,
            product,
            vendor_name,
            img,
            url: base + url,
            source: "Gamers Gate",
          });
        } else return;
      });
      if (specShop.length !== 0) {
        const filtered = specShop.filter((el) => {
          const duplicate = seen.has(el.title);
          seen.add(el.title);
          return !duplicate;
        });
        return res.json(paginateData(req, filtered));
      } else return message.errorMsg(search, "GamersGate");
    })
    .catch((error) => console.log(error));
};

export default gamersgateSales;

import axios from "axios";
import * as cheerio from 'cheerio';
import { textCleaner } from "../../assets/textCleaner.js";
import paginateData from "../../paginateData/paginateData.js";
import { currSupport } from "../../assets/currencySupport.js";
import { message } from "../../assets/messages.js";
import { calculations } from "../../assets/calculations.js";

const steamSpecials = async (req, res) => {
  const curr = req.query.currency ? req.query.currency : '';
  const max_price = req.query.maxprice ? `&maxprice=${req.query.maxprice}` : '';
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const currency = curr.toUpperCase();
  const currencySwapper = currSupport.steamCurrency(currency);
  return axios
    .get(`https://store.steampowered.com/search/?specials=1&cc=${currencySwapper}${max_price}`)
    .then((response) => {
      const html = response.data;
      const HTMLTransform = html.toLowerCase();
      const $ = cheerio.load(HTMLTransform);
      const specShop = [];
      $(`a[href*="https://store.steampowered.com/app/"]`, HTMLTransform, currency).each(function (index) {
        const cutoffdata = $(this).children().find("span");
        const firstster = $(this).children().find("span").contents().last();
        const dubster = $(this).children().find("div").contents().last();
        const rater = $(this).children().find("div");
        const title = cutoffdata.eq(0).text();
        const price_dirt = dubster.text();
        const old_price_dirt = firstster.text();
        const price_cut_dirt = cutoffdata.eq(3).text();
        const release_date = rater.eq(2).text();
        const ratingTooltip = rater.find("span").eq(2).data("tooltip-html");
        const rating = textCleaner.getSpecText(ratingTooltip, "<br>", 3);
        const price = textCleaner.removeTrash(price_dirt);
        const discount = textCleaner.removeTrash(price_cut_dirt);
        const old_price = textCleaner.removeTrash(old_price_dirt);
        const currency_tag = currSupport.tagCurrency(currency);
        const imgContener = $(this).children();
        const img = imgContener.find("img").attr("src");
        const url = $(this).attr("href");
        const priceComparer = price !== 'free' && price !== 'free to play' ? calculations.priceCompare(price, priceLimit) : '';
        const finalPrice = priceComparer[1];
        if (price !== "") {
          specShop.push({
            id: index,
            title,
            price: finalPrice ? finalPrice : 'free',
            currency: currency !== undefined ? currency : currency,
            currency_tag,
            old_price: old_price === title || old_price == "" ? "" : old_price,
            discount,
            rating,
            release_date,
            img,
            url,
            source: "Steam",
          });
        } else return;
      });
      if (specShop.length !== 0) {
        return res.json(paginateData(req, specShop));
      } else return message.errorMsg('', "Steam");
    })
    .catch((error) => console.log(error));
};
export default steamSpecials;

import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import { textCleaner } from "../../assets/textCleaner.js";
import { calculations } from "../../assets/calculations.js";

const instaGamingParts = (search, html, currency, priceLimitReq) => {
  const searchItem = textCleaner.marksLowerCase(search, "-");
  const specShop = [];
  const $ = cheerio.load(html);
  $(`a[href*="${searchItem}"]`, html, currency, priceLimitReq).each(function (index) {
    const master = $(this).parents().eq(0);
    const title = master.find(".fallback").text();
    const price = master.find(".price").text();
    const currency_tag = price.replace(/\d+.\d+/g, '');
    const discount = master.find(".discount").text();
    const img = master.find("img").data("src");
    const url = master.find("a").attr("href");
    const priceComparer = price !== '' ? calculations.priceCompare(price, priceLimitReq) : '';
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
    return specShop;
  } else return message.errorMsg(search, "Instant Gaming");
};

export default instaGamingParts;

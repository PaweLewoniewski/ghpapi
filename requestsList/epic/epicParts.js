import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import { textCleaner } from "../../assets/textCleaner.js";
import { currSupport } from "../../assets/currencySupport.js";
import { calculations } from "../../assets/calculations.js";

const epicParts = (search, html, priceLimitReq) => {
  const base = `https://www.epicgames.com`;
  const searchItem = textCleaner.marksLowerCase(search, "-");
  const specShop = [];
  const seen = new Set();
  const $ = cheerio.load(html);
  $(`a[href*="${searchItem}"]`, html, priceLimitReq).each(function (index) {
    const master = $(this).children();
    const title = master.find("span").first().text();
    const url = $(this).attr("href");
    const fullPrice = master.find("span").last().text();
    const price = textCleaner.removeAllLetters(fullPrice);
    const currency = textCleaner.removeAllNumbers(fullPrice);
    const currency_tag = currSupport.tagCurrency(currency);
    const discount = master.find("span").children().eq(1).text();
    const old_price = master.find("span").children().eq(2).text();
    const image = master.find("div");
    const img = image.find("img").data("image");
    const priceComparer = price !== '' ? calculations.priceCompare(price, priceLimitReq) : '';
    const finalPrice = priceComparer[1];
    if ((title !== "" && priceComparer[0] === true) || (title !== '' && priceLimitReq === '')) {
      specShop.push({
        id: index,
        title,
        price: finalPrice ,
        currency,
        currency_tag,
        discount: fullPrice === discount ? "" : discount,
        old_price,
        url: base + url,
        img,
        source: "Epic",
      });
    } else return;
  });
  if (specShop.length !== 0) {
    const filtered = specShop.filter((el) => {
      const duplicate = seen.has(el.title);
      seen.add(el.title);
      return !duplicate;
    });
    return filtered;
  } else return message.errorMsg(search, "Epic");
};

export default epicParts;

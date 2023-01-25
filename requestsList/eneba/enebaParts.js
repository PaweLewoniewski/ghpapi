import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import { textCleaner } from "../../assets/textCleaner.js";
import { currSupport } from "../../assets/currencySupport.js";
import { calculations } from "../../assets/calculations.js";

const enebaParts = (search, html, currency, priceLimitReq) => {
  const base = "https://www.eneba.com";
  const searchItem = textCleaner.marksLowerCase(search, "-");
  const specShop = [];
  const $ = cheerio.load(html);
  $(`a[href*="${searchItem}"]`, html , currency, priceLimitReq).each(function (index) {
    const pricer = $(this).find("div").children();
    const price = pricer.siblings(":eq(1)").text();
    const url = $(this).attr("href").toString();
    const master = $(this).parents(":eq(1)");
    const dubster = $(this).parents(":eq(0)");
    const title = dubster.siblings().find("span").text();
    const img = master.find("img").attr("src");
    const region = message.regionDisplay(url);
    const platform = message.systemPlatform(url);
    const currency_tag = currSupport.tagCurrency(currency);
    const activation_platform = message.platformDisplay(url);
    const priceComparer = price !== "Sold out" && price !== "" ? calculations.priceCompare(price, priceLimitReq): '';
    const finalPrice = priceComparer[1];
    if ((price !== "" && price !== "Sold out" && priceComparer[0] === true) 
    || (price !== "Sold out" && price !== '' && priceLimitReq === '')) {
      specShop.push({
        id: index,
        title,
        price: finalPrice,
        currency: currency !== undefined ? currency : 'EUR',
        currency_tag,
        platform,
        activation_platform,
        region,
        url: base + url,
        img: img,
        source: "Eneba",
      });
    } else return;
  });
  if (specShop.length !== 0) {
    return specShop;
  } else return message.errorMsg(search, "Eneba");
};

export default enebaParts;

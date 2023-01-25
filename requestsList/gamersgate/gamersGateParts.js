import * as cheerio from "cheerio";
import { message } from "../../assets/messages.js";
import { textCleaner } from "../../assets/textCleaner.js";
import { currSupport } from "../../assets/currencySupport.js";
import { calculations } from "../../assets/calculations.js";

const gamersGateParts = (search, html, priceLimitReq) => {
  const base = "https://www.gamersgate.com";
  const searchItem = textCleaner.marksLowerCase(search, "-");
  const specShop = [];
  const seen = new Set();
  const $ = cheerio.load(html);
  $(`a[href*="${searchItem}"]`, html).each(function (index) {
    const master = $(this).parents().eq(2);
    const dubster = $(this).parents().find(".product--item");
    const currency = dubster.data("currency");
    const currency_tag = currSupport.tagCurrency(currency);
    const title = master.find("a").text();
    //const price = dubster ? dubster.data("price").toString() : '';
    const vendor_name = dubster.data("vendor_name");
    const old_price = master.find("span").next().text();
    const price = master.find("span").eq(0).text();
    const url = master.find("a").attr("href");
    const img = master.find("img").attr("src");
    const discount = master.find(".product--label-discount").first().text();
    const product = master.find(".product--label-preorder").text();
    const priceComparer = price !== 'free' ? calculations.priceCompare(price, priceLimitReq) : '';
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
    return filtered;
  } else return message.errorMsg(search, "GamersGate");
};

export default gamersGateParts;

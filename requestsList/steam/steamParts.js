import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import { textCleaner } from "../../assets/textCleaner.js";
import { currSupport } from "../../assets/currencySupport.js";
import { calculations } from "../../assets/calculations.js";

const steamParts = (search, html, currency, priceLimitReq) => {
  const searchPage = textCleaner.marksLowerCase(search, "_");
  const HTMLTransform = html.toLowerCase();
  const $ = cheerio.load(HTMLTransform);
  const specShop = [];
  $(`a[href*="${searchPage}"]`, HTMLTransform, currency, priceLimitReq).each(function (index) {
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
    const priceComparer = price !== 'free' && price !== 'free to play' ? calculations.priceCompare(price, priceLimitReq) : '';
    const finalPrice = priceComparer[1];
     if ((price !== "" && priceComparer[0] === true) || (price !== '' && priceLimitReq === '')) {
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
    return specShop;
  } else return message.errorMsg(search, "Steam");
};

export default steamParts;

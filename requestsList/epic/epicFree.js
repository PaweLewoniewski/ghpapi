import axios from "axios";
import * as cheerio from 'cheerio';
import { message } from "../../assets/messages.js";
import paginateData from "../../paginateData/paginateData.js";
import { textCleaner } from "../../assets/textCleaner.js";

const epicFree = (req, res) => {
  return axios
    .get(
      `https://www.epicgames.com/store/en-US/free-games`
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
        const fullPrice = master.find("span").last().text();
        const price = textCleaner.removeAllLetters(fullPrice);
        const discount = master.find("span").children().eq(1).text();
        const image = master.find("div");
        const img = image.find("img").data("image");
        if (title !== "" && discount !== "") {
          specShop.push({
            id: index,
            title,
            price,
            currency:'',
            discount: '',
            old_price:'',
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

export default epicFree;

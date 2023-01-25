import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import instaGamingParts from "./instagamingParts.js";
import paginateData from "../../paginateData/paginateData.js";

const instaGamingShop = async (req, res) => {
  const search = req.params.search;
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const dlc = req.query.type ? `&gametype=dlc` : `&gametype=games`;
  const max_price = req.query.maxprice ? `&sort_by=&max_price=${req.query.maxprice}` : '';
  const curr = req.query.currency ? req.query.currency : '';
  const currency = curr.toUpperCase();
  const searchItem = textCleaner.marksLowerCase(search, "+");
  return axios
    .get(
      `https://www.instant-gaming.com/en/search/?q=${searchItem}&currency=${currency}${max_price}${dlc}`
    )
    .then((response) => {
      const html = response.data;
      return res.json(
        paginateData(req, instaGamingParts(search, html, currency, priceLimit))
      );
    })
    .catch((error) => console.log(error));
};
export default instaGamingShop;

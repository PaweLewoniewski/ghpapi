import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import steamParts from "./steamParts.js";
import paginateData from "../../paginateData/paginateData.js";
import { currSupport } from "../../assets/currencySupport.js";

const steamShop = async (req, res) => {
  const search = req.params.search;
  const max_price = req.query.maxprice ? `&maxprice=${req.query.maxprice}` : '';
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const curr = req.query.currency ? req.query.currency : '';
  const dlc = req.query.type ? `` : `&category1=998`;
  const currency = curr.toUpperCase();
  const searchItem = textCleaner.marksLowerCase(search, "+");
  const currencySwapper = currSupport.steamCurrency(currency);
  return axios
    .get(`https://store.steampowered.com/search/?term=${searchItem}&cc=${currencySwapper}${max_price}${dlc}`)
    .then((response) => {
      const html = response.data;
      return res.json(paginateData(req, steamParts(search, html, currencySwapper, priceLimit)));
    })
    .catch((error) => console.log(error));
};
export default steamShop;

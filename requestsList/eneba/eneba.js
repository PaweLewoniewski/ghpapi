import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import enebaParts from "./enebaParts.js";
import paginateData from "../../paginateData/paginateData.js";

const enebaShop = async (req, res) => {
  const search = req.params.search;
  const max_price = req.query.maxprice ? `&rangeTo=${req.query.maxprice}` : '';
  const dlc = req.query.type ? `&types[]=dlc` : `&types[]=game`;
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const curr = req.query.currency ? req.query.currency : '';
  const currency = curr.toUpperCase();
  const searchItem = textCleaner.marksLowerCase(search, "-");
  return axios
    .get(`https://www.eneba.com/store?text=${searchItem}&currency=${currency}${max_price}${dlc}`)
    .then((response) => {
      const html = response.data;
      return res.json(paginateData(req, enebaParts(search, html, currency, priceLimit)));
    })
    .catch((error) => console.log(error));
};
export default enebaShop;

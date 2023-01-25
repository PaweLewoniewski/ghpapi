import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import gamersGateParts from "./gamersGateParts.js";
import paginateData from "../../paginateData/paginateData.js";

const gamersGateShop = async (req, res) => {
  const search = req.params.search;
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  const dlc = req.query.type ? `` : `&dlc=on`;
  const max_price = req.query.maxprice ? `&price_lte=${req.query.maxprice}` : '';
  const searchItem = textCleaner.marksLowerCase(search, "+");
  return axios
    .get(`https://www.gamersgate.com/games/?query=${searchItem}${max_price}${dlc}`)
    .then((response) => {
      const html = response.data;
      return res.json(
        paginateData(req, gamersGateParts(search, html, priceLimit))
      );
    })
    .catch((error) => console.log(error));
};
export default gamersGateShop;

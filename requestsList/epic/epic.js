import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import epicParts from "./epicParts.js";
import paginateData from "../../paginateData/paginateData.js";

const epicShop = async (req, res) => {
  const search = req.params.search;
  const searchItem = textCleaner.marksLowerCase(search, "+");
  const priceLimit = req.query.maxprice ? req.query.maxprice : '';
  return await axios
    .get(
      `https://www.epicgames.com/store/en-US/browse?q=${searchItem}&sortBy=relevancy&sortDir=DESC&count=5&lang=en-US`
    )
    .then((response) => {
      const html = response.data;
      return res.json(paginateData(req, epicParts(search, html, priceLimit)));
    })
    .catch((error) => console.log(error));
};

export default epicShop;

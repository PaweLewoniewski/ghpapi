import axios from "axios";
import { textCleaner } from "../../assets/textCleaner.js";
import { currSupport } from "../../assets/currencySupport.js";
import enebaParts from "../eneba/enebaParts.js";
import gamersGateParts from "../gamersgate/gamersGateParts.js";
import instaGamingParts from "../instagaming/instagamingParts.js";
import steamParts from "../steam/steamParts.js";
import paginateData from "../../paginateData/paginateData.js";

const bestShopsPrice = async (req, res) => {
  const search = req.params.search;
  const max_price = req.query.maxprice ? req.query.maxprice : '';
  const curr = req.query.currency ? req.query.currency : '';

  const dlcEneba = req.query.type ? `&types[]=dlc` : `&types[]=game`;
  const dlcSteam = req.query.type ? `` : `&category1=998`;
  const dlcGgate = req.query.type ? `` : `&dlc=on`;
  const dlcIgaming = req.query.type ? `&gametype=dlc` : `&gametype=games`;

  const currency = curr.toUpperCase();
  const searchinDash = textCleaner.marksLowerCase(search, "-");
  const searchinPlus = textCleaner.marksLowerCase(search, "+");
  const currencySwapper = currSupport.steamCurrency(currency);


  const enebaRequest = axios
    .get(`https://www.eneba.com/store?text=${searchinDash}&currency=${currency}&rangeTo=${max_price}${dlcEneba}`)
    .then((response) => {
      const html = response.data;
      return enebaParts(search, html, currency, max_price);
    })
    .catch((error) => console.log(error));

  const steamRequest = axios
    .get(`https://store.steampowered.com/search/?term=${searchinPlus}&cc=${currencySwapper}&maxprice=${max_price}${dlcSteam}`)
    .then((response) => {
      const html = response.data;
      return steamParts(search, html, currencySwapper, max_price);
    })
    .catch((error) => console.log(error));

  const ggateRequest = axios
    .get(`https://www.gamersgate.com/games/?query=${searchinPlus}&price_lte=${max_price}${dlcGgate}`)
    .then((response) => {
      const html = response.data;
      return gamersGateParts(search, html, max_price);
    })
    .catch((error) => console.log(error));

  const instagamingRequest = axios
    .get(
      `https://www.instant-gaming.com/en/search/?q=${searchinPlus}&currency=${currency}&sort_by=&max_price=${max_price}${dlcIgaming}`
    )
    .then((response) => {
      const html = response.data;
      return instaGamingParts(search, html, currency, max_price);
    })
    .catch((error) => console.log(error));

  await Promise.all([
    enebaRequest,
    steamRequest,
    ggateRequest,
    instagamingRequest,
  ]).then((items) => {
    let allData = items.flat().sort((x, y) => x.price - y.price);
    let result = allData.map((card, index) => {
      card.id = index;
      const idCounted = { ...card };
      return idCounted;
    });
    res.json(paginateData(req, result));
  });
};
export default bestShopsPrice;

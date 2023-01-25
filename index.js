import express from "express";
import enebaShop from "./requestsList/eneba/eneba.js";
import epicShop from "./requestsList/epic/epic.js";
import epicFree from "./requestsList/epic/epicFree.js";
import gamersGateShop from "./requestsList/gamersgate/gamersgate.js";
import gamersgateSales from './requestsList/gamersgate/gamersgateSales.js';
import instaGamingShop from "./requestsList/instagaming/instagaming.js";
import instagamingTrending from "./requestsList/instagaming/instagamingTrending.js";
import multiRequestShops from "./requestsList/multishops/multiReqShop.js";
import steamShop from "./requestsList/steam/steam.js";
import steamSpecials from "./requestsList/steam/steamSpecials.js";
import bestShopsPrice from "./requestsList/bestShopsPrice/bestShopsPrice.js";
import { menuShops } from "./requestsList/menuApi/menuApi.js";
import cors from 'cors';


const PORT = process.env.PORT || 8000;

const app = express();

var corsOptions = {
  "origin": '*',
  'Access-Control-Allow-Origin':'*',
  "methods": "GET",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("Getting game Prices API");
});

app.get("/menu", (req, res) => {
  res.json(menuShops);
});

app.get("/allshops/:search", (req, res) => {
  multiRequestShops(req, res);
});

app.get("/bestprice/:search", (req, res) => {
  bestShopsPrice(req, res);
});

app.get("/epic/free", (req, res) => {
  epicFree(req, res);
});

app.get("/steam/specials", (req, res) => {
  steamSpecials(req, res);
});

app.get("/igaming/specials", (req, res) => {
  instagamingTrending(req, res);
});

app.get("/ggate/specials", (req, res) => {
  gamersgateSales(req, res);
});

app.get("/singleshop/:shopNameId/:search", (req, res) => {
  const shopNameId = req.params.shopNameId;
  switch (shopNameId) {
    case "steam":
      steamShop(req, res);
      break;
    case "eneba":
      enebaShop(req, res);
      break;
    case "epic":
      epicShop(req, res);
      break;
    case "ggate":
      gamersGateShop(req, res);
      break;
    case "igaming":
      instaGamingShop(req, res);
      break;
    default:
      console.log(`Sorry, no shop of ${shopNameId}.`);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
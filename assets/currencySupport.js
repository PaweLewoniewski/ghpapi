export const currSupport = {
  steamCurrency: (currency) => {
    switch (currency) {
      case "PLN":
        return "PL";
      case "USD":
        return "US";
      case "GBP":
        return "GB";
      case "EUR":
        return "EU";
      default:
        return "EU";
    }
  },
  tagCurrency: (currency) => {
    switch (currency) {
      case "PLN":
        return "zł";
      case "PL":
        return "zł";
      case "USD":
        return "$";
      case "US":
        return "$";
      case "GBP":
        return "£";
      case "GB":
        return "£";
      case "EU":
        return "€";
      default:
        return "€";
    }
  },
};

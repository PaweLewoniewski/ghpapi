export const calculations = {
  priceCompare: (dataPrice, limitPrice) => {
    if (dataPrice !== undefined && limitPrice !== undefined) {
    const dotPrice = dataPrice ? dataPrice.replace(/,/g, '.') : '';
    const priceNumber = dataPrice ? dotPrice.match(/[0-9]+([,.][0-9]+)?/) : "";
    const priceLimit = limitPrice ? parseFloat(limitPrice) : "";
    const priceData = priceNumber[0] !== null ? parseFloat(priceNumber[0]) : 0 ;
    return [priceLimit > priceData ? true : false , priceData];
    }
    else return;
  },
};

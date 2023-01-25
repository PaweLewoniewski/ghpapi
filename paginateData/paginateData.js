const paginateData = (req, data) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let results = {};
  if (endIndex < data.length) {
    results.nextPage = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prevPage = {
      page: page - 1,
    };
  }
  results.pageInfo = {
    totalResults: data.length,
    limit:limit
  };
  results.results = data.slice(startIndex, endIndex);
  return results;
};
export default paginateData;
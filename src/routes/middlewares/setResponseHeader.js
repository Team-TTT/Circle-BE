const setResponseHeader = (req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Origin", process.env.REQUEST_DOMAIN);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");

  if (req.method === "OPTIONS") {
    return res.end();
  }

  return next();
};

module.exports = setResponseHeader;

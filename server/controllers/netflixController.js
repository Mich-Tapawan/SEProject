exports.subscribe = (req, res) => {
  res.send("subscribed to Netflix");
};

exports.checkStatus = (req, res) => {
  res.send("Netflix subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Netflix.");
};

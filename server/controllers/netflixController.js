exports.subscribe = (req, res) => {
  res.send("subscribed to netflix");
};

exports.checkStatus = (req, res) => {
  res.send("Netflix subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Netflix.");
};

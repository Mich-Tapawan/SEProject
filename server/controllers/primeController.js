exports.subscribe = (req, res) => {
  res.send("subscribed to Prime Videos");
};

exports.checkStatus = (req, res) => {
  res.send("Prime Videos subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Prime Videos.");
};

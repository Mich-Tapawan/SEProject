exports.subscribe = (req, res) => {
  res.send("subscribed to HBO GO");
};

exports.checkStatus = (req, res) => {
  res.send("HBO GO subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from HBO GO.");
};

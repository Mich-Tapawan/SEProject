exports.subscribe = (req, res) => {
  res.send("subscribed to Disney+");
};

exports.checkStatus = (req, res) => {
  res.send("Disney+ subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Disney+.");
};

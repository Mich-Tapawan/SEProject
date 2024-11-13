exports.subscribe = (req, res) => {
  res.send("subscribed to Youtube Premium");
};

exports.checkStatus = (req, res) => {
  res.send("Youtube Premium subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Youtube Premium.");
};

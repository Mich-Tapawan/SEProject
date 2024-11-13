exports.subscribe = (req, res) => {
  res.send("subscribed to Spotify Premium");
};

exports.checkStatus = (req, res) => {
  res.send("Spotify Premium subscription is active.");
};

exports.unsubscribe = (req, res) => {
  res.send("Unsubscribed from Spotify Premium.");
};

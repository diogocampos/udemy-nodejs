exports.textMessage = (from, text) => ({
  from,
  text,
  createdAt: Date.now(),
})

exports.locationMessage = (from, { latitude, longitude }) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: Date.now(),
})

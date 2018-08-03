exports.createMessage = (from, text) => ({
  from,
  text,
  createdAt: Date.now(),
})

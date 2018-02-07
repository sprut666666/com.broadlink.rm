const generate = require('nanoid/generate')

module.exports = function uuid() {
  return generate('1234567890abcdefghijklmnopqrstuvwxyz', 15)
}

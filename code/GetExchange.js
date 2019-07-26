var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getExchange () {
  var items = [
    {
      exchange: "usd",
      symbol: "$"
    },
    {
      exchange: "krw",
      symbol: "₩"
    },
    {
      exchange: "btc",
      symbol: "₿"
    }
  ]
  return items
}

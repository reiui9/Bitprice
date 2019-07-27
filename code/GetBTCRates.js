var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getBTCRates (coins) {
  var krakenMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/kraken'
  var bithumbMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/bithumb'
  var targetMarketBaseUrl = krakenMarketBaseUrl
  // coins.coin = coins.coin
  // coins.exchange = coins.exchange.toLowerCase()
  if (coins.exchange.toLowerCase() == 'krw') {
    targetMarketBaseUrl = bithumbMarketBaseUrl
  }
  var result = {
    price: {
      last: 1,
      high: 1,
      low: 1,
      change: {
        percentage: 0,
        absolute: 0
      }
    },
    volume: 0,
    chart: {
      url: config.get('chart.bitcoin')
    },
    coins: coins
  }
  /*
      {
      "result": {
        "price":{
          "last": 780.31,
          "high": 790.34,
          "low": 772.76,
          "change": {
            "percentage": 0.0014373838,
            "absolute": 1.12
          }
        },
        "volume": 5345.0415
      }
    }
  */
  // TODO: handle special case more elegant way
  if (coins.exchange == coins.coin) {
    return result
  }
  var response = http.getUrl(targetMarketBaseUrl + '/' + coins.coin.toLowerCase() + coins.exchange.toLowerCase() + '/summary', { format: 'json' })
  result.price = response.result.price
  result.volume = response.result.volume
  return result
}

var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getCoin () {
  var krakenMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/kraken'
  var coins = [
    "BTC",
    "DASH",
    "ETH",
    "ETC",
    "LTC",
    "XRP",
    "BCH",
    "XMR",
    "ZEC",
    "EOS"
  ]
  var items = []

  coins.forEach(coin => {
    var item = {
      coin: coin,
      image: {
        url: ""
      },
      price: 0.0
    }
    var response = http.getUrl(krakenMarketBaseUrl + '/' + coin + 'usd/price', { format: 'json' })
    item.price = response.result.price
    item.image.url = '/images/'+coin+'.jpg'
    items.push(item)
  })
  return items
}

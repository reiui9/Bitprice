var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getCoin () {
  var krakenMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/kraken'
  var coins = [
    "btc",
    "dash",
    "eth",
    "etc",
    "ltc",
    "xrp",
    "bch",
    "xmr",
    "zec",
    "eos"
  ]
  // image setting
  var images = []
  images[0] = config.get('image.bitcoin')
  images[1] = config.get('image.ethereum')
  images[2] = config.get('image.litecoin')

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
    item.image.url = images[Math.round(response.result.price) % 3]
    items.push(item)
  })
  return items
}

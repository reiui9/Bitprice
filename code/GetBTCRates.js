var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getBTCRates (coins) {
  console.log("GET /ticker without any parameter!)")
  // Read the remote.url value from capsule.properties
  var response = http.getUrl(config.get('blockchain.url') + '/ticker', { format: 'json' })

  // image setting
  var images = []
  images[0] = config.get('image.bitcoin')
  images[1] = config.get('image.ethereum')
  images[2] = config.get('image.litecoin')

  var result
  var items = []
  for (var currency in response) {
    var item = response[currency]
    // image random setting
    item.image = {}
    item.image.url = images[Math.floor(item['15m'] % 3)]
    item.chart = {}
    item.chart.url = config.get('chart.bitcoin')
    item.coins = coins
    item.quarterBefore = item['15m']
    delete item['15m']
    item.currency = currency
    items.push(item)
  }
  if (coins.coin === 'many'){
    result = items
  } else {
    items[0].currency = coins.coin
    result = items[0]
  }
  return result
}

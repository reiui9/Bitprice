var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getBTCRates (coins) {
  console.log("GET /ticker without any parameter!)")
  
  var response = http.getUrl(config.get('blockchain.url') + '/ticker', { format: 'json' })

  var items = []
  for (var currency in response) {
    var item = response[currency]
    item.chart = {}
    item.chart.url = config.get('chart.bitcoin')
    item.coins = coins
    item.quarterBefore = item['15m']
    delete item['15m']
    item.currency = currency
    items.push(item)
  }
  
  return items[0]
}

var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getExchange () {
  var exchanges = [
    'USD',
    'KRW',
    'BTC'
  ]
  var items = []

  exchanges.forEach(exchange => {
    var item = {
      exchange: exchange,
      image: {
        url: ""
      }
    }
    item.image.url = '/images/'+exchange+'.jpg'
    items.push(item)
  })
  return items
}

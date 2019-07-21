var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getExchange () {
  console.log("GET /ticker without any parameter!)")
  // Read the remote.url value from capsule.properties
  var response = http.getUrl(config.get('blockchain.url') + '/ticker', { format: 'json' })
  
  // image setting
  var images = []
  images[0] = config.get('image.bitcoin')
  images[1] = config.get('image.ethereum')
  images[2] = config.get('image.litecoin')

  var items = []
  for (var currency in response) {
    var item = {
      exchange: currency,
      image: {
        url: ""
      }
    }
    // image random setting
    item.image.url = images[Math.floor(response[currency]['15m'] % 3)]
    items.push(item)
  }
  return items
}

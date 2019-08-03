var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function getExchange () {

  var items = [
    {
      exchange: "USD",
      image: { url: '/images/USD.jpg' },
      symbol: "$"
    },
    {
      exchange: "KRW",
      image: { url: '/images/KRW.jpg' },
      symbol: "₩"
    },
    {
      exchange: "BTC",
      image: { url: '/images/BTC.jpg' },      
      symbol: "₿"
    }
  ]
    
  // var exchanges = [
  //   'USD',
  //   'KRW',
  //   'BTC'
  // ]
  // var items = []

  // exchanges.forEach(exchange => {
  //   var item = {
  //     exchange: exchange,
  //     image: {
  //       url: ""
  //     }
  //   }
  //   item.image.url = '/images/'+exchange+'.jpg'
  //   items.push(item)
  // })
  return items
}

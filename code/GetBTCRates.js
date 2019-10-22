var http = require('http')
var console = require('console')
var config = require('config')

function getCoinNews (coin, count) {
  if (!Number.isInteger(count) || count < 1) {
    count = 10
  }
  coin = coin.toLowerCase()
  // slug mapping
  var slug = {
    btc: 'bitcoin',
    dash: 'dash',
    eth: 'ethereum',
    etc: 'ethereum-classic',
    ltc: 'litecoin',
    xrp: 'ripple',
    bch: 'bitcoin-cash',
    xmr: 'monero',
    zec: 'zcash',
    eos: 'eos'
  }
  var apiKey = config.get('cryptocontrol.api.news.key')
  var apiUrl = config.get('cryptocontrol.api.base.url')
  
  // GET 'https://cryptocontrol.io/api/v1/public/news/coin/{slug}?key={apiKey}'
  var response = http.getUrl(apiUrl + '/api/v1/public/news/coin/' + slug[coin] + '?key=' + apiKey, { format: 'json' })
  var results = []
  for (var i = 0; i < count; i++) {
    var news = response[i]
    var ret = {}
    ret.title = news.title
    ret.description = news.description
    ret.thumbnail = news.thumbnail || news.originalImageUrl
    ret.url = news.url
    results.push(ret)
  }
  return results
}

// https://gist.github.com/jiggzson/b5f489af9ad931e3d186
function scientificToDecimal(num) {
  // if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
      var zero = '0',
          parts = String(num).toLowerCase().split('e'), // split into coeff and exponent
          e = parts.pop(), // store the exponential part
          l = Math.abs(e), // get the number of zeros
          sign = e / l,
          coeff_array = parts[0].split('.')
      if (sign === -1) {
          coeff_array[0] = Math.abs(coeff_array[0]);
          num = '-'+zero + '.' + new Array(l).join(zero) + coeff_array.join('')
      } else {
          var dec = coeff_array[1]
          if(dec) l = l - dec.length
          num = coeff_array.join('') + new Array(l+1).join(zero)
      }
  }
  
  return num
}

function decimalToKRW(decimal) {
  var 억 = Math.pow(10, 8)
  var 만 = Math.pow(10, 4)
  var krw = ""
  decimal = parseInt(decimal)
  var negative = false
  if (decimal < 0) {
    decimal = -decimal
    negative = true
  }
  if (decimal > 억) {
    var num = Math.floor(decimal / 억)
    krw = num.toString() + "억"
    decimal = decimal % 억
  }
  if (decimal > 만) {
    if (krw != "") {
      krw = krw + " "
    }
    var num = Math.floor(decimal / 만)
    krw = krw + num.toString() + "만"
    decimal = decimal % 만
  }
  if (krw != "") {
    krw = krw + " "  
  }
  krw = krw + decimal.toString()
  if (negative) {
    krw = '-' + krw
  }
  return krw
}

function getOhlcData(market, coin, exchange, period, count) {
  if (period === undefined) {
    period = 86400 // sec
  }
  if (count === undefined) {
    count = 5
  }
  var pair = coin.toString().toLowerCase() + exchange.toString().toLowerCase()
  // https://api.cryptowat.ch/markets/coinbase-pro/btcusd/ohlc
  var baseUrl = config.get('cryptowatch.api.base.url')
  var currentTimestamp = Math.floor(Date.now() / 1000)
  var after = currentTimestamp - period * (count)
  var response = http.getUrl(baseUrl + '/markets/' + market + '/' + pair + '/ohlc?after=' + after + '&periods=' + period, { format: 'json' })
  var results = []
  var rawData = response.result[period]
  rawData = rawData.slice(0, count)
  rawData.forEach(item => {
    var result = {}
    // [ CloseTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume ]
    result.open = item[1]
    result.high = item[2]
    result.low = item[3]
    result.close = item[4]
    result.up = item[1] <= item[4]
    var date = new Date(item[0] * 1000)
    result.date = (date.getMonth() + 1).toString() + '-' + date.getDate()
    results.push(result)

  })
  return results
}

module.exports.function = function getBTCRates (coins) {
  var krakenMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/kraken'
  var bithumbMarketBaseUrl = config.get('cryptowatch.api.base.url') + '/markets/bithumb'
  var targetMarketBaseUrl = krakenMarketBaseUrl
  var market = 'kraken'
  // change symbol to string type
  coins.coin = coins.coin.toString()
  coins.exchange = coins.exchange.toString()

  if (coins.exchange.toLowerCase() == 'krw') {
    targetMarketBaseUrl = bithumbMarketBaseUrl
    market = 'bithumb'
  }
  var result = {
    price: {
      last: "1",
      high: "1",
      low: "1",
      change: {
        percentage: 0,
        absolute: "0"
      }
    },
    volume: 0,
    chart: {
      url: config.get('chart.bitcoin')
    },
    coins: coins,
    news: [],
    ohlc: []
  }
  result.news = getCoinNews(coins.coin)
  // TODO: handle special case more elegant way
  if (coins.exchange.toLowerCase() == coins.coin.toLowerCase()) {
    return result
  }
  var response = http.getUrl(targetMarketBaseUrl + '/' + coins.coin.toLowerCase() + coins.exchange.toLowerCase() + '/summary', { format: 'json' })
  result.price = response.result.price
  for (var key in result.price) {
    if (key != 'last' && key != 'high' && key != 'low') {
      continue
    }
    result.price[key] = scientificToDecimal(result.price[key].toString())
    if (coins.exchange.toLowerCase() == 'krw') {
      result.price[key] = decimalToKRW(result.price[key])
    }
  }
  result.price.change.percentage = Math.round(result.price.change.percentage*1000)/10
  
  console.log(result.price.change.absolute)
  console.log(typeof(result.price.change.absolute))
  result.price.change.absolute = scientificToDecimal(result.price.change.absolute.toString())
  if (coins.exchange.toLowerCase() == 'krw') {
    result.price.change.absolute = decimalToKRW(result.price.change.absolute)
  }
  console.log(result.price.change.absolute)
  console.log(typeof(result.price.change.absolute))
  result.ohlc = getOhlcData(market, coins.coin, coins.exchange)
  result.volume = response.result.volume
  console.log(result)
  return result
}

// get a coin by using selection
// if exchange is not defined, set it as 'USD'
// return 'Coins' model

module.exports.function = function getCoins (coin, exchange) {
  if (coin == undefined) {
    coin = 'many'
  }
  if (exchange == undefined) {
    exchange = 'USD'
  }
  return {
    coin: coin,
    exchange: exchange
  }
}

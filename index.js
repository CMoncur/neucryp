const Axios = require('axios')
    , Brain = require('brain.js')
    , Cron  = require('cron').CronJob

/* NEURAL NETWORK */
// Instantiate neural network
let neucryp = new Brain.NeuralNetwork()

const dummyData =
  [ { input: [ 0, 0 ], output: { true: 0, false: 1 } }
  , { input: [ 0, 1 ], output: { true: 1, false: 0 } }
  , { input: [ 1, 0 ], output: { true: 1, false: 0 } }
  , { input: [ 1, 1 ], output: { true: 0, false: 1 } }
  ]

neucryp.train(dummyData)

console.log(neucryp.run([0,1]))

const fetchData = async () => {
  const rawCryptoData = await Axios.get('https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&e=CCCAGG&limit=1')
  console.log(rawCryptoData.data.Data)
}

/* CRON */
// Base cron settings
const cronSettings =
  { cronTime: '0 * * * * *' // First second of every minute of every hour of ...
  , onTick: fetchData
  , start: false
  }

// Cron for training neural network and logging prediction
const app = new Cron(cronSettings)

/* APPLICATION */
// Start the application
app.start()

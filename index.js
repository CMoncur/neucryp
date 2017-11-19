const Axios = require('axios')
    , Brain = require('brain.js')
    , Cron  = require('cron').CronJob

/* CONSTANTS */
const BASE_API_URL = 'https://min-api.cryptocompare.com/data/histominute'
const BASE_API_PARAMS =
  { fsym: 'ETH'
  , tsym: 'USD'
  , e: 'CCCAGG'
  , limit: 1
  }

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

/*
rawCryptoData.data.Data
[ { time: 1511130060,
    close: 356.18,
    high: 356.24,
    low: 355.68,
    open: 355.68,
    volumefrom: 468.34,
    volumeto: 166628.33 },
  { time: 1511130120,
    close: 356.22,
    high: 356.26,
    low: 356.16,
    open: 356.18,
    volumefrom: 80.73,
    volumeto: 28767.74 } ]
*/
const fetchData = async () => {
  const apiRes = await Axios.get(BASE_API_URL, { params: BASE_API_PARAMS })

  switch (apiRes.status && apiRes.data.Response) {
    case 200 && 'Success':
      console.log("yeah")
      // train(apiRes.data.Data)
      break

    default:
      console.log("aw shiet")
      break
  }

  // console.log(rawCryptoData)
}

/* CRON */
// Base cron settings
const cronSettings =
  { cronTime: '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *' // First second of every minute of every hour of ...
  , onTick: fetchData
  , start: false
  }

// Cron for training neural network and logging prediction
const app = new Cron(cronSettings)

/* APPLICATION */
// Start the application
app.start()

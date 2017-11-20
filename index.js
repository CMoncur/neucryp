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

/*
Example response data:
[ { time: 1511130060
  , close: 356.18
  , high: 356.24
  , low: 355.68
  , open: 355.68
  , volumefrom: 468.34
  , volumeto: 166628.33
  }
, { time: 1511130120
  , close: 356.18
  , high: 356.24
  , low: 355.68
  , open: 355.68
  , volumefrom: 0
  , volumeto: 0
  }
]
*/
const train = (data) => {
  // Use head of array for input, as most recent entry is often incomplete
  const input = data[0]

  // Last item in array will always contain closing price
  const output = data[1]

  const neuralNetInput =
    { volumeto: input.volumeto
    , volumefrom: input.volumefrom
    }

  const neuralNetOutput = { price: output.close }

  console.log("Training:")
  console.log("Inputs: ", neuralNetInput)
  console.log("Outputs: ", neuralNetOutput)
  neucryp.train([ { input: neuralNetInput, output: neuralNetOutput } ])

  if (output.volumeto !== 0 && output.volumefrom !== 0) {
    const prediction = neucryp.run(
      { volumeto: output.volumeto
      , volumefrom: output.volumefrom
      }
    )

    console.log("Predicting: ", prediction)
  }
}

const fetchData = async () => {
  const apiRes = await Axios.get(BASE_API_URL, { params: BASE_API_PARAMS })

  switch (apiRes.status && apiRes.data.Response) {
    case 200 && 'Success':
      train(apiRes.data.Data)
      break

    default:
      console.log("aw shiet")
      break
  }
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

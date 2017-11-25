const Axios = require("axios")
const Brain = require("brain.js")
const Chalk = require("chalk")
const Cron  = require("cron").CronJob

/* CONSTANTS */
const BASE_API_URL = "https://min-api.cryptocompare.com/data/histominute"
const BASE_API_PARAMS = {
  fsym: "ETH",
  tsym: "USD",
  e: "CCCAGG",
  limit: 1,
}

/* NEURAL NETWORK */
// Instantiate neural network
const neucryp = new Brain.NeuralNetwork()

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

  const neuralNetInput = {
    volumeto: input.volumeto,
    volumefrom: input.volumefrom,
  }

  const neuralNetOutput = () => {
    if (output.close > output.open) {
      return { price_rise: 1 }
    }

    return { price_rise: 0 }
  }

  console.log(Chalk.yellow.bold("TRAINING"))
  console.log(Chalk.yellow("Inputs: ", JSON.stringify(neuralNetInput)))
  console.log(Chalk.yellow("Outputs: ", JSON.stringify(neuralNetOutput())))
  neucryp.train([ { input: neuralNetInput, output: neuralNetOutput() } ])

  if (output.volumeto !== 0 && output.volumefrom !== 0) {
    const prediction = neucryp.run({
      volumeto: output.volumeto,
      volumefrom: output.volumefrom,
    })

    console.log(Chalk.green.bold("PREDICTING"))
    console.log(Chalk.green("Prediction: ", JSON.stringify(prediction)))
  }
}

const fetchData = async () => {
  const apiRes = await Axios.get(BASE_API_URL, { params: BASE_API_PARAMS })

  switch (apiRes.status && apiRes.data.Response) {
  case 200 && "Success":
    train(apiRes.data.Data)
    break

  default:
    console.log("aw shiet")
    break
  }
}

/* CRON */
// Base cron settings
const cronSettings = {
  cronTime: "0 * * * * *", // First second of every minute of every hour of ...
  onTick: fetchData,
  start: false,
}

// Cron for training neural network and logging prediction
const app = new Cron(cronSettings)

/* APPLICATION */
// Start the application
app.start()

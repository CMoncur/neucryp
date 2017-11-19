const Brain   = require('brain.js')
    , CronJob = require('cron').CronJob;

let Neurcryp = new Brain.NeuralNetwork()

const dummyData =
  [ { input: [ 0, 0 ], output: { true: 0, false: 1 } }
  , { input: [ 0, 1 ], output: { true: 1, false: 0 } }
  , { input: [ 1, 0 ], output: { true: 1, false: 0 } }
  , { input: [ 1, 1 ], output: { true: 0, false: 1 } }
  ]

Neurcryp.train(dummyData)

const job = new CronJob(
  { cronTime: '0 * * * * *' // First second of every minute of every hour of ...
  , onTick: () => console.log(Neurcryp.run([ 1, 0 ]))
  , start: false
  }
)

job.start()

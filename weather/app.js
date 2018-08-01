const yargs = require('yargs')

const apis = require('./apis')

const args = yargs
  .scriptName('weather')
  .option('a', {
    alias: 'address',
    describe: 'Address for which to fetch the weather',
    type: 'string',
    demandOption: true,
  })
  .parse()

main(async () => {
  const address = await apis.getAddress(args.address)
  const weather = await apis.getWeather(address.lat, address.lng)
  console.log(address.formatted_address)
  console.log(`It's currently ${weather.temperature}.`)
  console.log(`It feels like ${weather.apparentTemperature}.`)
})

//

async function main(fn) {
  try {
    await fn()
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

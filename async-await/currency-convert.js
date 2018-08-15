const fetch = require('node-fetch')

async function main() {
  try {
    const amount = 20
    const from = 'USD'
    const to = 'BRL'

    const converted = await convertCurrency(amount, from, to)
    const format = (amount, currency) => `${amount.toFixed(2)} ${currency}`
    console.log(`${format(amount, from)} is worth ${format(converted, to)}.`)

    const countries = await getCountriesByCurrency(to)
    console.log(`You can spend it in ${list(countries)}.`)
  } catch (err) {
    console.error('Oops:', err.message)
  }
}

async function convertCurrency(amount, from, to) {
  const rate = await getExchangeRate(from, to)
  return rate * amount
}

async function getExchangeRate(from, to) {
  const fixerData = {
    success: true,
    timestamp: Date.now(),
    base: 'EUR',
    date: new Date().toISOString().slice(0, 10),
    rates: { BRL: 4.294668, CAD: 1.53061, EUR: 1.0, USD: 1.198758 },
  }

  const { rates } = fixerData
  const rate = rates[to] / rates[from]
  if (isNaN(rate)) throw new Error(`No exchange rate between ${from} and ${to}`)

  return rate
}

async function getCountriesByCurrency(code) {
  const url = `https://restcountries.eu/rest/v2/currency/${code}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`No countries with currency '${code}'`)

  const countries = await response.json()
  return countries.map(_ => _.name)
}

function list(things) {
  return things.length < 3
    ? things.join(' and ')
    : `${things.slice(0, -1).join(', ')}, and ${things[things.length - 1]}`
}

main()

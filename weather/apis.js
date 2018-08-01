const fetch = require('node-fetch')
const qs = require('querystring')

const keys = require('./keys')

exports.getAddress = async address => {
  const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json'
  const key = keys.googleMapsApiKey
  const url = `${endpoint}?${qs.stringify({ address, key })}`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Address request failed')

  const body = await response.json()
  if (body.status === 'ZERO_RESULTS') throw new Error('Address not found')
  if (body.status !== 'OK') throw new Error(body.status)

  const {
    formatted_address,
    geometry: {
      location: { lat, lng },
    },
  } = body.results[0]
  return { formatted_address, lat, lng }
}

exports.getWeather = async (lat, lng) => {
  const endpoint = 'https://api.darksky.net/forecast'
  const key = keys.darkSkyApiKey
  const url = `${endpoint}/${key}/${lat},${lng}`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Weather request failed')

  const body = await response.json()
  return body.currently
}

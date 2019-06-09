const express = require('express')
const hbs = require('hbs')

const app = express()

app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('currentYear', () => new Date().getFullYear())
hbs.registerHelper('scream', text => text.toUpperCase())

app.use(logger)
// app.use(maintenance)

app.use(express.static(__dirname + '/public'))

app.get('/', home)
app.get('/about', about)
app.get('/projects', projects)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))

//

function logger(req, res, next) {
  const now = new Date().toString()
  console.log(`${now}: ${req.method} ${req.url}`)
  next()
}

function maintenance(req, res, next) {
  res.render('maintenance')
}

function home(req, res) {
  res.render('home', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome!',
  })
}

function about(req, res) {
  res.render('about', { pageTitle: 'About Page' })
}

function projects(req, res) {
  res.render('projects', { pageTitle: 'Projects' })
}

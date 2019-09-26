require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

function validateBearerToken(req, res, next) {
	
	const authToken = req.get("Authorization")
	const apiToken = process.env.API_TOKEN

	console.log('validate bearer token middleware')

	if(!authToken || authToken.split(' ')[1] !== apiToken) {
		return res.status(401).json({ error: 'Unauthorized request' })
	}

	next()
}

app.use(validateBearerToken);

function handleGetMovie(req, res) {
	const { genre, country, avg_vote } = req.query;

	const searchResults = MOVIES.filter(m => {
		const genreMatches = !genre || m.genre.toLowerCase().includes(genre.toLowerCase());
		const countryMatches = !country || m.country.includes(country);
		const avgVoteMatches = !avg_vote || Number(m.avg_vote) >= Number(avg_vote);
		return genreMatches && countryMatches && avgVoteMatches;
	});

	res.json(searchResults);
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

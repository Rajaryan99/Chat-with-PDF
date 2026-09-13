import express from 'express'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send("hello world")
})

app.listen(port, (req, res) => {
	console.log(`server is running on http://localhost:${port}`)
})

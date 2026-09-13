import express from 'express'
import 'dotenv/config'
import multer from 'multer';

const upload = multer({dest: 'uploads/'})

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send("hello world")
})

app.post('/upload', upload.single('pdf'), (req, res) => {
    console.log(req.file)
    res.send("file uploaded successfully")

})

app.listen(port, (req, res) => {
	console.log(`server is running on http://localhost:${port}`)
})

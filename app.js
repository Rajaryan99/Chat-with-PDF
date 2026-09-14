import express from 'express'
import 'dotenv/config'
import multer from 'multer';
import fs from 'node:fs/promises'
import {PDFParse} from 'pdf-parse'

const upload = multer({dest: 'uploads/'})

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send("hello world")
})

app.post('/upload', upload.single('pdf'), async (req, res) => {
    
try {
     console.log(req.file)
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = new PDFParse({data: dataBuffer})
    const pdfText = await pdfData.getText()
    console.log(pdfText.text)
     res.send(["file uploaded successfully",pdfText.text] )
    
} catch (error) {
    console.error(error)
    res.status(500).send("Error reading file")
    
}
   
})



app.listen(port, (req, res) => {
	console.log(`server is running on http://localhost:${port}`)
})

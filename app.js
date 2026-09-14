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
    const text = pdfText.text

    const chunks = text.split('\n\n')



    // for(let i=0; i<=text.length; i+=500){
    //     chunks.push(text.slice(i, i+500))
    // }


    console.log(chunks)

    res.json({

        totalChunks: chunks.length,
        chunks,
    })
    
} catch (error) {
    console.error(error)
    res.status(500).send("Error reading file")
    
}
   
})



app.listen(port, (req, res) => {
	console.log(`server is running on http://localhost:${port}`)
})

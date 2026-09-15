import express from 'express'
import 'dotenv/config'
import multer from 'multer';
import fs from 'node:fs/promises'
import {PDFParse} from 'pdf-parse'
import {GoogleGenAI} from '@google/genai';



// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


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
    console.log(chunks)



    // for(let i=0; i<=text.length; i+=500){
    //     chunks.push(text.slice(i, i+500))
    // }


    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Explain this PDF in plan and easy way ${chunks[0]}`
    })

    res.status(200).send(response.text)
    
} catch (error) {
    console.error(error.message)
    res.status(500).send("Error reading file")
    
}
   
})



app.listen(port, (req, res) => {
	console.log(`server is running on http://localhost:${port}`)
})

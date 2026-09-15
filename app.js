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

async function createEmbadding(text) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
    });

    return response.embeddings
}

const upload = multer({dest: 'uploads/'})

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send("hello world")
})

app.post('/upload', upload.single('pdf'), async (req, res) => {
    
try {
     console.log(req.body)
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = new PDFParse({data: dataBuffer})
    const pdfText = await pdfData.getText()
    const text = pdfText.text

    const chunks = text.split('\n\n').filter((chunk) => chunk.trim() != "" )
    // console.log(chunks)

    const embaddings  = await createEmbadding(chunks[0])
    console.log(embaddings)

    // for(let i=0; i<=text.length; i+=500){
    //     chunks.push(text.slice(i, i+500))
    // }

    const question = req.body.question
    const matchChunk = chunks.find((chunk) => chunk.toLocaleLowerCase().includes('raj aryan'))
    console.log("Matching chunks: ", matchChunk)


    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Answer the question using context ${matchChunk} and question is ${question}`
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

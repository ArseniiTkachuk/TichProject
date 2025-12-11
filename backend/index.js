import cors from 'cors'
import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as ParController from './controllers/ParController.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PORT = 1111


mongoose
    .connect('mongodb+srv://arseniitkachuk_db_user:rashamon2009@cluster0.dcqg0py.mongodb.net/tichProject?appName=Cluster0',)
    .then(() => console.log('BD OK'))
    .catch((err) => console.log('BD error: ', err))


const app = express()

app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json())


app.get('/getPars', ParController.getPars)
app.post('/checkPars', ParController.checkPars)


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
});
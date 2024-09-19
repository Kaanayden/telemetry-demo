require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { register, DiagLogLevel } = require('infrastack-interview-fs-ka');
const storageRouter = require('./routers/storageRouter');


register({
    endpoint: 'http://localhost:4317', // Your OTLP endpoint
    instruments: ['http', 'express', 'fs', 'system'], // List the libraries you want to instrument
    serviceName: process.env.SERVICE_NAME || 'image-server', // Optional: Define the service name
    logLevel: DiagLogLevel.DEBUG,
})


const app = express()
const port = process.env.PORT || 3000



app.use(cors());
app.use(express.json());


const defaultRouter = express.Router();

defaultRouter.get('/', (req, res) => {
  res.send('This is image server!')
})

defaultRouter.use('/public', express.static('public'))
defaultRouter.use('/storage', storageRouter)

app.use('/image-server', defaultRouter);
  
app.listen(port, () => {
  console.log(`Image server listening on port ${port}`)
})
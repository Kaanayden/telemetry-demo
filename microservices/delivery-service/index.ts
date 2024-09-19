import express, { Request, Response, } from 'express';
import { register, DiagLogLevel } from 'infrastack-interview-fs-ka'
import bodyParser from 'body-parser';


register({
    endpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4317', // Your OTLP endpoint
    instruments: ['http', 'express', 'system'], // List the libraries you want to instrument
    serviceName: process.env.SERVICE_NAME || 'delivery-service', // Optional: Define the service name
    logLevel: DiagLogLevel.DEBUG,
})

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint for getting delivery prices
app.get('/delivery-price', (req: Request, res: Response) => {
    const randomPrice = Math.floor(Math.random() * 100) + 1;
    res.json({ price: randomPrice });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
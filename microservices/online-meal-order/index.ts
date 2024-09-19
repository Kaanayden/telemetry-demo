import express, { Request, Response, } from 'express';
import { register, DiagLogLevel } from 'infrastack-interview-fs-ka'
import bodyParser from 'body-parser';


register({
    endpoint: 'http://localhost:4317', // Your OTLP endpoint
    instruments: ['http', 'express', 'system'], // List the libraries you want to instrument
    serviceName: process.env.SERVICE_NAME || 'meal-order', // Optional: Define the service name
    logLevel: DiagLogLevel.DEBUG,
})

const app = express();
const port = process.env.PORT || 8200;

app.use(bodyParser.json());

// Endpoint for placing an order
app.post('/orders', (req: Request, res: Response) => {
    const { mealId, quantity } = req.body;

    // Process the order and return a response
    // ...

    res.status(200).json({ message: 'Order placed successfully' });
});

// Endpoint for getting order details
app.get('/orders/:orderId', (req: Request, res: Response) => {
    const { orderId } = req.params;

    // Retrieve order details from the database
    // ...

    res.status(200).json({ orderId, mealId: '123', quantity: 2, status: 'Delivered' });
});

// Endpoint for purchasing an order
app.post('/orders/purchase', (req: Request, res: Response) => {
    const { mealId, quantity, restaurantId } = req.body;

    // Process the purchase order and return a response
    // ...

    res.status(200).json({ message: 'Order purchased successfully' });
});

// Endpoint for getting restaurants
app.get('/restaurants', (req: Request, res: Response) => {
    // Retrieve restaurants from the database


    // Randomly return an internal server error
    if (Math.random() < 0.5) {
        res.status(500).json({ message: 'Internal Server Error' });
    } else {
        res.status(200).json([
            { id: '1', name: 'Restaurant A' },
            { id: '2', name: 'Restaurant B' },
            { id: '3', name: 'Restaurant C' },
        ]);
    }

});

// Endpoint for getting a specific restaurant
app.get('/restaurants/:restaurantId', (req: Request, res: Response) => {
    const { restaurantId } = req.params;

    // Retrieve restaurant details from the database
    // ...

    res.status(200).json({ id: restaurantId, name: 'Restaurant A' });
});

// Endpoint for getting meal details
app.get('/meals/:mealId', (req: Request, res: Response) => {
    const { mealId } = req.params;

    // Retrieve meal details from the database
    // ...

    res.status(200).json({ id: mealId, name: 'Meal A', price: 10.99 });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
import express, { Request, Response, } from 'express';
import { register, DiagLogLevel } from 'infrastack-interview-fs-ka'
import bodyParser from 'body-parser';
import fs from 'fs';

register({
    endpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4317', // Your OTLP endpoint
    instruments: ['http', 'express', 'system'], // List the libraries you want to instrument
    serviceName: process.env.SERVICE_NAME || 'meal-order', // Optional: Define the service name
    logLevel: DiagLogLevel.DEBUG,
})

const app = express();
const port = process.env.PORT || 3000;

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

// Endpoint for getting menu image
app.post('/restaurants/comment/upload-picture', async (req: Request, res: Response) => {
 
    const form = new FormData()

    const exampleImage = fs.readFileSync('./assets/exampleImage.jpeg');
    const blob = new Blob([exampleImage], { type: 'image/jpeg' });
    console.log("blob", blob)
    form.append('images', blob, 'menu.jpg');

    const resp = await fetch(`${process.env.SERVICE_URL}:${process.env.IMAGE_PORT}/image-server/storage/uploadBatch`, {
        method: "PUT",
        body: form,
        headers: {
            "authentication": process.env.AUTHENTICATION_TOKEN || ""
        }
    });

    res.status(200).json({ message: 'Image uploaded successfully' });
});

// Endpoint for purchasing an order
app.post('/orders/purchase', async (req: Request, res: Response) => {
    const { mealId, quantity, restaurantId } = req.body;

    // Process the purchase order and return a response
    // ...

    await fetch(
        `${process.env.SERVICE_URL}:${process.env.MEAL_RESTAURANT_PORT}/notify-restaurant/${restaurantId || 'default'}`,
        {
        method: 'PUT',

    }

    );

    res.status(200).json({ message: 'Order purchased successfully' });
});

// Endpoint for getting delivery location information
app.get('/orders/where-is-delivery', (req: Request, res: Response) => {
    const { deliveryId } = req.body;

    // Process the purchase order and return a response
    // ...

    res.status(200).json({ message: 'Order delivery status is ...' });
});


// Endpoint for updating delivery location information
app.put('/inform-delivery-status', (req: Request, res: Response) => {
    const { deliveryId, status } = req.body;

    // Process the purchase order and return a response
    // ...

    res.status(200).json({ message: 'Order delivery status is informed to the user' });
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
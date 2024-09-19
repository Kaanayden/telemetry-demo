import express, { Request, Response, } from 'express';
import { register, DiagLogLevel } from 'infrastack-interview-fs-ka'
import bodyParser from 'body-parser';
import fs from 'fs';


register({
    endpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4317', // Your OTLP endpoint
    instruments: ['http', 'express', 'system', 'fs'], // List the libraries you want to instrument
    serviceName: process.env.SERVICE_NAME || 'meal-restaurant-owner', // Optional: Define the service name
    logLevel: DiagLogLevel.DEBUG,
})

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


async function getDeliveryPrices() {
    // Call the 3rd party APIs to get the delivery prices
    // ...


    const apis = [`${process.env.SERVICE_URL}:${process.env.DELIVERY_PORT1}/get-delivery-prices`,
    `${process.env.SERVICE_URL}:${process.env.DELIVERY_PORT2}/get-delivery-prices`,
    `${process.env.SERVICE_URL}:${process.env.DELIVERY_PORT3}/get-delivery-prices`,
    `${process.env.SERVICE_URL}:${process.env.DELIVERY_PORT4}/get-delivery-prices`
    ];

    const prices: { url: string; price: number; }[] = [];

    apis.forEach(async (api) => {
        const resp = await fetch(api);
        const json = await resp.json();
        prices.push({ url: api, price: json.price });
    });

    // Return the delivery prices
    return prices;
}

async function uploadMenuImage() {
    // Call the API to upload the menu image
    const form = new FormData()

    const exampleImage = fs.readFileSync('./assets/exampleImage.jpeg');
    const blob = new Blob([exampleImage], { type: 'image/jpeg' });
    form.append('images', blob, 'menu.jpg');

    const resp = await fetch(`${process.env.SERVICE_URL}:${process.env.IMAGE_PORT}/image-server/storage/uploadBatch`, {
        method: "PUT",
        body: form,
        headers: {
            "Authentication": process.env.IMAGE_SERVER_AUTH || ""
        }
    });

    const json = await resp.json();
}

function getMenuItems(restaurantId: string) {
    // Call the API to get the menu items
    // ...

    // Return the menu items
    return [
        { id: 1, name: 'Burger', price: 10 },
        { id: 2, name: 'Pizza', price: 15 },
        { id: 3, name: 'Salad', price: 8 },
    ];
}

function processOrder(menuItemId: number, quantity: number) {
    // Process the order and return the order ID
    // ...

    return 12345;
}


app.get('/get-delivery-prices', async (req: Request, res: Response) => {
    // Call the 3rd party food delivery services to get the delivery prices
    const deliveryPrices = await getDeliveryPrices();

    // Return the delivery prices to the client
    res.json(deliveryPrices);
});

app.post('/upload-menu/:restaurantId', async (req: Request, res: Response) => {
    // Call the API to upload the menu image
    await uploadMenuImage();

    // Return a success message to the client
    res.json({ message: 'Menu image uploaded successfully' });
});

// Other routes and functionality for the restaurant owners

app.get('/menu/:restaurantId', (req: Request, res: Response) => {
    // Get the restaurant ID from the request parameters
    const restaurantId = req.params.restaurantId;

    // Call the API to get the menu items for the specified restaurant
    const menuItems = getMenuItems(restaurantId);

    // Return the menu items to the client
    res.json(menuItems);
});

app.post('/order/:restaurantId', (req: Request, res: Response) => {
    // Get the order details from the request body
    const { menuItemId, quantity } = req.body;

    // Process the order and return a success message to the client
    const orderId = processOrder(menuItemId, quantity);
    res.json({ message: 'Order placed successfully', orderId });
});

app.post('/notify-restaurant/:restaurantId', (req: Request, res: Response) => {

    // Notify the restaurant about the new order
    // ...

    res.json({ message: 'Restaurant notified about the new order' }).status(200);

});

app.put('/update-delivery-status/', async (req: Request, res: Response) => {
    // Get the order ID from the request parameters
    const deliveryId = req.params.deliveryId;

    await fetch(
        `${process.env.SERVICE_URL}:${process.env.MEAL_ORDER_PORT}/inform-delivery-status`,
        {
            method: 'PUT',
            body: JSON.stringify({ deliveryId, status: 'Delivered' }),
        })

    res.json({ message: 'Order status updated successfully' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
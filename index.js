require('dotenv').config();
const express = require('express');
const app = express();
const { CloudTasksClient } = require('@google-cloud/tasks')

app.use(express.json());

async function createHttpTask(req) {
    const client = new CloudTasksClient()
    const {PROJECT, QUEUE, LOCATION} = process.env
    const parent = client.queuePath(PROJECT, LOCATION, QUEUE);
    // TODO(developer): uncomment the line bellow and uses ngrok to call this api in the path POST /handler or uses another url
    // const url = 'https://ef4b-177-107-22-3.sa.ngrok.io/handler';
    const payload = JSON.stringify({
        contact: {
            email: req.email,
            firstName: 'Danilo',
            lastName: 'Bandeira',
            customFields: [
                {
                    'id': '1',
                    'phone': '000000000'
                },
                {
                    'id': '2',
                    'cellphone': '000000000'
                }
            ]
        }
    });
    const body = Buffer.from(payload).toString('base64');
    const task = {
        httpRequest: {
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': req.apiToken
            },
            httpMethod: 'POST',
            url,
            body
        },
        scheduleTime: {
            seconds: (Number(req.seconds) || 10) + Date.now() / 1000
        },
    };
    console.log('Sending task:');
    console.log(task);
    console.log('Task size in kb: ', Buffer.byteLength(JSON.stringify(task), 'base64') / 1024)
    const request = {parent, task};
    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);
}

app.post('/', async function(req, res) {
    try {
        const { seconds, email, product_name: productName } = req.body;
        await createHttpTask({ apiToken: req.headers['api-token'], seconds, email, productName })
        return res.status(200).send('Google Cloud Tasks will be called soon');
    } catch(err) {
        return res.status(500).send(err.message);
    }
})

app.post('/handler', function(req, res) {
    console.log('Called by Cloud Tasks.')
    if(req.headers['api-token'] === '123456') {
        // print error in gcp cloud logging
        console.error(Error('Error in api'));
        return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(200).send({ message: 'Success' });
})

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Listen at: http://localhost:${PORT}`)
});

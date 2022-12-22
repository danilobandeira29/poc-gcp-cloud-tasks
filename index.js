require('dotenv').config();
const express = require('express');
const app = express();
const { CloudTasksClient } = require("@google-cloud/tasks")

app.use(express.json());

async function createHttpTask() {
    const client = new CloudTasksClient()
    const {PROJECT, QUEUE, LOCATION} = process.env
    console.log(PROJECT, QUEUE, LOCATION)
    const parent = client.queuePath(PROJECT, LOCATION, QUEUE);
    // TODO(developer): uncomment the line bellow and uses ngrok to call this api in the path POST /handler or uses another url
    // const url = 'https://d7c9-177-107-22-3.sa.ngrok.io/handler';
    const payload = JSON.stringify({
        message: "hello, world!"
    });
    const body = Buffer.from(payload).toString('base64');
    const inSeconds = 15;
    const task = {
        httpRequest: {
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': '123456'
            },
            httpMethod: 'POST',
            url,
            body
        },
        scheduleTime: {
            seconds: inSeconds + Date.now() / 1000
        }
    };
    console.log('Sending task:');
    console.log(task);
    const request = {parent, task};
    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);
}

app.post('/', async function(_, res) {
    try {
        await createHttpTask()
        return res.status(200).send('Google Cloud Tasks will be called soon');
    } catch(err) {
        return res.status(500).send(err.message);
    }
})

app.post('/handler', function(req, res) {
    // console.log('Body: ', req.body);
    console.log('Headers: ', req.headers);
    // const throwError = Math.floor(Math.random()*11) < 5;
    // if (throwError) {
    console.error(Error('Error in api'));
    return res.status(500).send({ message: "Internal Server Error" });
    // }
    // console.log('Called by Google Cloud Tasks');
})

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Listen at: http://localhost:${PORT}`)
});

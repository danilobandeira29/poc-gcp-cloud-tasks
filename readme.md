Provide credentials for Application Default Credentials(ADC):

```bash
$ gcloud auth application-default login
```

More details: [Provide credentials for Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc).

Add your envs:
```.dotenv
PROJECT=
QUEUE=
LOCATION=
```

And start api:
```bash
$ npm install
$ npm run start
```

Now the api is listening on port 3000.

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


Casos de uso:

- Diminuir o “response time” para o usuário final: delegar algum processo lento para um worker, banco de dados.

- Prevenir o consumo excessivo ou programação defensiva para chamar api de terceiros: Com retries e scheduleTime é possível limitar o número de vezes que a api de terceiros é chamada, respeitando o rate limit, por exemplo.

Particularidades:

- Gerais:
    - Roda na infraestrutura de um App Engine, inclusive na sua localidade.
    - Permite chamadas “http target” ou “app engine target”.
    - Não podem existir múltiplos handlers para uma mesma task, seja  “http target” e/ou “app engine target”.
    - Retry configurável.
    - Controle de rate/delivery.

- Queue:
    - Não é implicitamente uma fila. Caso tasks sejam criadas sem o “scheduleTime”, elas não serão executadas em FIFO.
    - Tasks podem ser processadas de maneira concorrente, já que não é exatamente uma estrutura FIFO.

- Task:
    - Permite inserção em escala.*
    - O tamanho limite de uma task é de 1mb(buffer string).**
    - Não podem existir tasks com mesmo nome(duplicada).
    - Em nome de tasks são apenas aceitos: letters, numbers, hyphens or underscore. Com tamanho de 1 a 500 caracteres.
    - Quando uma task de nome xyz é deletada, não é possível criar imediatamente outra task com o mesmo nome xyz. Existe uma latência de ~4h para a criação de outra task com mesmo nome de uma já deletada. Caso a task tenha sido criada fazendo uso de um arquivo .xml ou .yaml essa latência pode ser ~9d.***
    - Em 99% dos casos tasks são executadas apenas uma vez.

<br>
* Existem praticas recomendadas ou patterns para a inserção de milhões/bilhões de tasks. Verificar documentação: https://cloud.google.com/tasks/docs/manage-cloud-task-scaling#large-scalebatch_task_enqueues

** O tamanho pode variar. Verificar documentação: https://cloud.google.com/tasks/docs/quotas.

*** O tempo de latência pode variar. Para maior precisão dessa informação, verificar a documentação: https://cloud.google.com/tasks/docs/reference/rest/v2/projects.locations.queues.tasks/create#body.request_body.FIELDS.task.

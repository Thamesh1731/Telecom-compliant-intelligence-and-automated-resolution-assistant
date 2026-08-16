# AWS deployment

The root `Dockerfile` starts the FastAPI service on `0.0.0.0` and uses the
`PORT` value supplied by AWS. It is suitable for AWS App Runner or an
ECS/Fargate service behind a load balancer.

## Local container check

```bash
docker build -t telecom-resolution-api .
docker run --env-file .env -p 8000:8000 telecom-resolution-api
```

## App Runner

Connect the repository, choose the Dockerfile, expose port `8000`, and add
the secrets from `.env.example` in the service configuration. Set
`ALLOWED_ORIGINS` to the deployed frontend URL.

## ECS/Fargate

Build the image, push it to ECR, create a task definition with container port
`8000`, and place the service behind an Application Load Balancer. Configure
the same environment variables as task-definition secrets.

The current priority scheduler is in-process and intended for one running API
task. Before scaling to multiple AWS tasks, replace it with SQS plus a durable
status store such as DynamoDB so queue state is shared across instances.

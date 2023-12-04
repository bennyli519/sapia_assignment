# Getting Start
## Sequence Diagram
<img width="918" alt="image" src="https://github.com/bennyli519/sopia/assets/22862720/9f197ca6-d2a3-4b5c-88d0-760f2889c0ec">

## Back-end

## Folder structure
```
├── database(seed for docker)
│   ├── data
│   └── mongo-init.js
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth
│   ├── common
│   ├── interceptor
│   ├── main.ts
│   ├── redis
│   └── user
├── test
│   ├── e2e
│   └── jest-e2e.json
├── docker-compose.yaml
├── nest-cli.json
├── package-lock.json
├── package.json
├── Dockerfile
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```
### Enter to the folder and start
```bash
cd sopia/sopia-api
yarn 
```
### Config environment variables
```bash
cp .env.example .env
```
### Run the container
```bash
docker compose up -d
```
### Front-end
```bash
cd sopia/web-app
yarn
yarn start
```

### Access the API
##### Development
- API: http://localhost:4001
- Web: http://localhost:3000

### CURL example
```bash
curl --location --request POST 'localhost:4001/auth/login' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"dev@gmail.com",
    "password":"dev"
}'
```

### Demo account
Email               | Password    |
--------------------| ------------|
dev@gmail.com       | dev         |

### Demo Recording

[record.webm](https://github.com/bennyli519/sopia/assets/22862720/34ba9d80-4104-41b2-9ac2-a40eea8545f1)

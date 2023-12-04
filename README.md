# Getting Start

## Back-end

```bash
cd sopia-api
yarn 
```
### Run the container
```bash
docker compose up -d
```

### Front-end
```bash
cd web-app
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

REQUIRED: .env file in backend/ containing:
```
DB_HOST='host'
DB_PORT=port
DB_USER='user'
DB_PASSWORD='password'
DB_DATABASE='database'

SESSION_SECRET='secret'
```

Install packages:
```
/frontend ~ npm install
/backend  ~ npm install
```

"Production":
```
/frontend ~ npm run-script build
```
Copy /build folder into ../backend/
```
/backend  ~ npm start
```

Development:
```
/backend  ~ npm run dev
```
```
/frontend ~ npm start
```

## TODO
insert multiple recrods eg. cols = [[...], [...], [...]]
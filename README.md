REQUIRED: .env file in backend/ containing:
```
DB_HOST='host'
DB_PORT=port
DB_USER='user'
DB_PASSWORD='password'
DB_DATABASE='database'

SESSION_SECRET='secret'
```

"Production":
```
/frontend ~ npm run-script build
```
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
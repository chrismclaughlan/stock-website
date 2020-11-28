NOTE: store item names in lowercase!

REQUIRED: .env file in backend/ containing:
`
DB_HOST='host'
DB_PORT=port
DB_USER='user'
DB_PASSWORD='password'
DB_DATABASE='database'

SESSION_SECRET='secret'
`

=================

insomnia helps

`
npm run build
npm run <start || dev>
`

Useful git commands:
`
git add *
git status
git commit -m "message"
git push
`

Using CURL to test:
`
curl --data '' localhost:4000/stock
curl -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:4000/login
`

To connect to mysql in cmd:
`
mysql -h <HOST> --port <PORT> -u <USER> --password

show databases;
USE <DATABASE>;
show tables;
`

//TODO db.escape(var)
//TODO insert multiple recrods eg. cols = [[...], [...], [...]]
// middleware to authorise users?
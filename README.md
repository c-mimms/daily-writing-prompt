Base app that supports users and making posts.

Useful commands for local development:
Connect to local db ```psql postgres://postgres:postgres@localhost:5432```
Connect to remote db ```fly postgres connect -a <postgres-app-name>```
Start app ```npm run dev```

Migrating postgres versions
1. Create new postgres fly app with docker image with new version
fly postgres create --image-ref toranb/pgvector
2. Backup existing database
Connect to old database
pg_dump (DATABASE_URL) > dumpfile
Connect to new database
pgsql (DATABASE_URL) < dumpfile
3. Disconnect fly from old database
flyctl postgres detach --app (APP_NAME) (DATABASE_APP_NAME)
4. Connect fly app to new database
flyctl postgres attach --app (APP_NAME) (DATABASE_APP_NAME)
5. Deploy updated secrets
fly secrets deploy

![home screen](screenshots/homeScreen.png)
![authed screen](screenshots/loggedIn.png)
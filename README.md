# ecentials-backend

This is a Nodejs, Mongodb backend.

# project file structure

```
|--- private
|       |--- database
|               |--- mongodbjs.js *mongodb configuration is included here*
|       |--- schemas *include all database schemas here
|
|--- routes *most of the code base would be written in this folder.*
|       |--- auth.js
|
|--- keys.json *contains the database name, server port number*
|
|--- LICENCE
|
|--- package-lock.json
|
|--- package.json
|
|--- README.md
```

# install dependencies

1. `npm i` _This installs all the dependencies in package.json_

# run

2. `npm start` _Start the server on port 3001_

// Already covered in part 1
const express = require('express')
const app = express()

/*
    This is the library responsible for reading the properties
    from the file .env, located in the root of the project. It
    makes those properties available in the process.env object.
*/
require('dotenv').config()

// Already covered in part 2
const accountsRouter = require('./controller/account')
const transactionsRouter = require('./controller/transaction')
const webhooksRouter = require('./controller/webhooks')
const statsRouter = require('./controller/stats')

/*
    Here we are just importing the router we've created at the
    file controller/authentication.js. See that file for more details.
*/
const authenticationRouter = require('./controller/authentication')

// Already covered in part 1
const port = process.env.DEFAULT_PORT

// Already covered in part 2
app.use(express.json())


// Already covered in part 2
app.use(accountsRouter)
app.use(transactionsRouter)
app.use(webhooksRouter)
app.use(statsRouter)

/*
    Here we are just attaching the router we've created at the
    file controller/authentication.js. See that file for more details.
*/
app.use(authenticationRouter)

// Already covered in part 1
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Already covered in part 1
app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})

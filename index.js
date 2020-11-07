const defaultServer = require('./server')
defaultServer.server.listen(
    defaultServer.PORT, 
    () => console.log('listening on port: ' + defaultServer.PORT)
)
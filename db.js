var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

let init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE documents (jdoc JSON)")
        db.run("CREATE TABLE schema (jdoc JSON, active BOOLEAN)")
        db.run("CREATE TABLE stats (jdoc JSON)")
    })
}

let save = (doc) => {
    try {
        db.serialize(() => {
            db.run("INSERT INTO documents VALUES('" + JSON.stringify(doc) + "')")
        })
    } catch (e) {
        console.error(e)
    }
}

let list = (callback) => {
    db.all("select rowid, jdoc from documents",[], (err, rows) => {
            callback(rows)
    })
}

let saveSchema = (doc, active) => {
    try {
        db.serialize(() => {
            db.run("UPDATE schema SET active = false")
            db.run("INSERT INTO schema VALUES('" + JSON.stringify(doc) + "', " + (active ? true : false) + ")")
        })
    } catch (e) {
        console.error(e)
    }
}

let listSchema = (callback) => {
    db.all("select rowid, jdoc, active from schema",[], (err, rows) => {
            callback(rows)
    })
}

let saveStats = (doc) => {
    try {
        db.serialize(() => {
            db.run("INSERT INTO stats VALUES('" + JSON.stringify(doc) + "')")
        })
    } catch (e) {
        console.error(e)
    }
}

let listStats = (callback) => {
    db.all("select rowid, jdoc from stats",[], (err, rows) => {
            callback(rows)
    })
}

module.exports.init = init
module.exports.save = save
module.exports.list = list
module.exports.saveSchema = saveSchema
module.exports.listSchema = listSchema
module.exports.saveStats = saveStats
module.exports.listStats = listStats
const rxjs = require('rxjs')
const db = require('./db')
const path = require('path')
const fs = require('fs')
const validator =  require('./validator')


let readContent = (filename) => {
    try {
        console.log('fetching data from : ' + filename)
        return fs.readFileSync(filename, 'utf8')
    } catch (err) {
        console.error(err)
        return ''
    }
}

let listFiles = (dir) => {
    try {
        return fs.readdirSync(dir)
    } catch (err) {
        console.error('nothing found in : ' + dir)
        return []
    }
}

let importData = () => {
    let data = []
    let inputs = listFiles('./inputs')
    inputs.forEach(i => {
        if (i.endsWith('.json')) data.push(readContent('./inputs/' + i))
    })
    return data
}

let initApp = () => {
    let schema0 = readContent('./schemas/schema.json')
    db.saveSchema(schema0, true)
    let jList = importData()
    jList.forEach(j => db.save(j))
    let v = new validator.JsonValidator()
    v.selectSchema(JSON.parse(schema0))
    jList.map(j => v.validate(JSON.parse(j))).forEach(s => db.saveStats(s))
}

module.exports = (app) => {
    db.init()
    let home$ = new rxjs.Subject()
    const REPORT_PATH = '/report'

    initApp()

    app.get('/', (req, res) => home$.next([req, res]))
    home$
    .subscribe((args) => {
            let [req, res] = args
            res.sendFile(path.join(__dirname + REPORT_PATH + '/index.html'))
    })

    let list$ = new rxjs.Subject()
    app.get('/json/list', (req, res) => list$.next([req, res]))
    list$
    .subscribe((args) => {
            let [req, res] = args
            let results = []
            db.list((rows) => {
                rows.forEach(r => {
                  results.push(JSON.parse(r.jdoc))
                })
                console.log(results)
                res.send(results)
            })
    })

    let save$ = new rxjs.Subject()
    app.post('/json/save', (req, res) => save$.next([req, res]))
    save$
    .subscribe((args) => {
            let [req, res] = args
            console.log(req.body)
            if (req.body) db.save(req.body)
            else console.log('invalid body sent')
            res.send('done')
    })

    let updateSchema$ = new rxjs.Subject()
    app.post('/schema/update', (req, res) => updateSchema$.next([req, res]))
    updateSchema$
    .subscribe((args) => {
            let [req, res] = args
            console.log(req.body)
            if (req.body) db.saveSchema(req.body)
            else console.log('invalid body sent')
            res.send('done')
    })

    let listSchema$ = new rxjs.Subject()
    app.get('/schema/list', (req, res) => listSchema$.next([req, res]))
    listSchema$
    .subscribe((args) => {
            let [req, res] = args
            let results = []
            db.listSchema((rows) => {
                rows.filter(r => r.active).forEach(r => {
                  results.push(JSON.parse(r.jdoc))
                })
                console.log(results)
                res.send(results)
            })
    })

    let validate$ = new rxjs.Subject()
    app.get('/schema/validate', (req, res) => validate$.next([req, res]))
    validate$
    .subscribe((args) => {
            let [req, res] = args
            let jsonList = []
            db.list((rows) => {
                rows.forEach(r => {
                    jsonList.push(r)
                })
            })

            let schemaList = []
            db.listSchema((rows) => {
                rows.filter(r => r.active == true).forEach(r => {
                    schemaList.push(r)
                })
            })

            let schema = schemaList[0]
            let v = new validator.JsonValidator()
            v.selectSchema(schema)
            res.send(v.validateAll(jsonList))
    })

    let listStats$ = new rxjs.Subject()
    app.get('/stats/list', (req, res) => listStats$.next([req, res]))
    listStats$
    .subscribe((args) => {
            let [req, res] = args
            let results = []
            db.listStats((rows) => {
                rows.forEach(r => {
                  results.push(JSON.parse(r.jdoc))
                })
                console.log(results)
                res.send(results)
            })
    })

}
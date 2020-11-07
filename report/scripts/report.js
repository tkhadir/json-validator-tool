let jsonList = []
let schema = {}
let stats = []



let displayStats = (results) => {
    var ctx = $("#myChart").get(0).getContext('2d')
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: [results['docs']],
            datasets: [{
                label: 'json documents validation status',
                backgroundColor: 'rgb(0,255,127)',
                borderColor: 'rgb(255, 99, 132)',
                data: [results['stats']]
            }]
        },
        options: {}
    })
}


let showChart = () => {
    let results = {'docs': [], 'stats': []}
    jsonList.forEach((json, i) => {
        stats.filter((s, j) => i == j).forEach(s => {
            results['docs'].push('doc' + (i + 1))
            results['stats'].push(s.errors.length == 0 ? 100 : ((s.errors.length / Object.keys(json).length) * 100))
        })
    })
    displayStats(results)
}

let fetchSchema = () => {
    let options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }
    fetch('http://localhost:3000/schema/list', options)
    .then(response => {
        response.json().then(data => {
            console.log(data)
            $("#current-schema").html('')
            data.forEach(d => {
                $("#current-schema").html('<p>' + d + '</p>')
            })
        }).catch(e => console.log(e))
    })
    .catch(error => {
        console.error(error)
        alert('an error occcured during fetchall : ' + error)
    })
}

let fetchDocs = () => {
    let options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }
    fetch('http://localhost:3000/json/list', options)
    .then(response => {
        response.json().then(data => {
            $("#doc-list").html('')
            data.forEach((d, i) => {
                $("#doc-list").html('<h3>doc' + (i + 1) + '</h3><p>' + d + '</p>')
            })
            jsonList = data
        }).catch(e => console.log(e))
    })
    .catch(error => {
        console.error(error)
        alert('an error occcured during fetchall : ' + error)
    })
}

let fetchStats = () => {
    let options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    }
    fetch('http://localhost:3000/stats/list', options)
    .then(response => {
        response.json().then(data => {
            $("#stat-list").html('')
            data.forEach(d => {
                $("#stat-list").html('<p>' + JSON.stringify(d) + '</p>')
            })
            stats = data
            showChart()
        }).catch(e => console.log(e))
    })
    .catch(error => {
        console.error(error)
        alert('an error occcured during fetchall : ' + error)
    })
}
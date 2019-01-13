import axios from 'axios'

export function createBlackboard(callback: Function, body: object) {
    axios.post('/blackboard/create/',
        JSON.parse(JSON.stringify(body)),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then(function (response) {
            callback(response.data)
        })
        .catch(function (error) {
        })
}

export function findBlackboardByUser(callback: Function, body: object) {
    axios.post('/blackboard/find/one',
        JSON.parse(JSON.stringify(body)),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then(function (response) {
            callback(response.data)
        })
        .catch(function (error) {
        })
}

export function removeBlackboard(callback: Function, body: object) {
    axios.post('/blackboard/remove',
        JSON.parse(JSON.stringify(body)),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
        .then(function (response) {
            callback(response.data)
        })
        .catch(function (error) {
        })
}
import axios from 'axios'

export function userLogin(callback: Function, body: object) {
    axios.post('/users/login/',
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

export function userRegister(callback: Function, body: object) {
    axios.post('/users/register/',
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

export function findUserByID(callback: Function, body: object) {
    axios.post('/users/find/one',
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

'use strict';

var request = require('superagent');

var config = require('config');

var Keyston = {
    login: function(username, password, callback) {
        request
            .post(config('remote').keyston + '/v3/auth/tokens')
            .send({
                "auth": {
                    "identity": {
                        "methods": [
                            "password"
                        ],
                        "password": {
                            "user": {
                                "name": username,
                                "domain": {
                                    "id": "default"
                                },
                                "password": password
                            }
                        }
                    }
                }
            })
            .end(function(err, res) {
                callback(err, res);
            });
    },
    logout: function(token, callback) {
        var request = new Requst('DELETE', global.config.remote.keyston + '/v3/auth/tokens');
        request.setHeader('X-Subject-Token', token).exec(null, function(error, body, response) {
            callback(error, body, response);
        });
        request.exec(null, function(error, body, response) {
            callback(error, body, response);
        });
    },
    getProjects: function(token, callback) {

        request
            .get(config('remote').keyston + '/v3/projects')
            .set('X-Auth-Token', token)
            .end(function(err, res) {
                callback(err, res);
            });
    }
}

module.exports = Keyston;
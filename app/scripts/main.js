'use strict';

var angular = require('angular');

var welcomeController = require('./controllers/WelcomeController');

var app = angular.module('myApp', []);

app.controller('WelcomeController', ['$scope', welcomeController]);


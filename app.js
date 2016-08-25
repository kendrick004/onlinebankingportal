/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

//set view engine to ejs
app.set('view engine', 'ejs');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// session for express
app.use(session({secret:'qnxdemobillportal', resave:false, saveUninitialized: true}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var users = [
	{
		id: 1,
		email: "kendrick_crucillo@questronix.com.ph",
		name: "Kendrick",
		pass: "password1",
		img: 'public/assets/images/avatar4.png',
		account_no: "000000020000"
	},
	{
		id: 2,
		email: "pmelemos@unionbankph.com",
		name: "Paulo",
		pass: "password1",
		img: 'public/assets/images/avatar5.png',
		account_no: "000000020001"
	}
];


var navigation = [
	{path: '/account', name: 'Account', active: 0, icon: 'fa-user'},
	{path: '/transfer', name: 'Transfer', active: 0, icon: 'fa-send'},
	{path: '/payment', name: 'Payment', active: 0, icon: ' fa-money'},
	{path: '/branches', name: 'Branch List', active: 0, icon: 'fa-bank'},
	{path: '/atms', name: 'ATM List', active: 0, icon: 'fa-map-marker'},
	{path: '/logout', name: 'Sign-Out', active: 0, icon: 'fa-sign-out'}
];

//app.set('client-id', '491f8bd9-a068-4220-a226-aa5695cc40fd');
//app.set('client-secret', 'J8uC0lM2uJ1oK6bC3pU5sW2iJ2vV7cF7pD5qH6kE7dT7wV6uV1');
//app.set('rest_url', 'https://api.us.apiconnect.ibmcloud.com/ubp-dev/sb/api');
app.set('client-id', 'e66e3a7a-8ab0-4f59-917a-860b0c0a1bdc');
app.set('client-secret', 'cQ4aG6rU5gQ0rS4rM2sM6pF7gE5gK3vV1lB0uG6qI4vC1lX6dQ');
app.set('rest_url', 'https://api.us.apiconnect.ibmcloud.com/unionbank-unionbank-hackathon/sb/api');
app.set('request_headers',	
		{
 			'accept': 'application/json',
     		'content-type': 'application/json',
     		'x-ibm-client-secret': app.get('client-secret'),
     		'x-ibm-client-id': app.get('client-id')  	
     	}
);

app.set('navigation', navigation);
app.set('users', users);
app.set('dateformat', dateFormat);

require('./routes/routes')(app);

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

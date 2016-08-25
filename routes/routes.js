//app secret	: J8uC0lM2uJ1oK6bC3pU5sW2iJ2vV7cF7pD5qH6kE7dT7wV6uV1
//app id		: 491f8bd9-a068-4220-a226-aa5695cc40fd
var request = require('request');

module.exports = function(app){
	app.get('/logout', function(req, res){
		req.session.destroy();
    	res.redirect('/login');
	});

	app.get('/login', function(req, res){
		var page = {
			title: 'Online Banking | Login Page',
			name: 'Login Page',
			portal_name: 'Online Banking'
		};

		res.render('pages/login', {
			page: page
		});
	});

	app.post('/login', function(req, res){
		var users = app.get('users');
		var email = req.body.email;
		var pass = req.body.password;
		var user = {};
		var msg = "";
		for(var i=0;i<users.length;i++){
			if(users[i].email == email){
				user = users[i];
			}
		}
		if(user.email == email){
			if(user.pass != pass){
				user = {};
				msg = "Incorrect Password";
			}else{
				req.session.login = user;
			}
		}else{
			user = {};
			msg = "Incorrect Email/Password";
		}
		res.send({
			user: user,
			msg: msg
		});
	});

	app.post('/checkaccount', function(req, res){
		var options = { 
			method: 'GET',
		  	url: app.get('rest_url') + '/RESTs/getAccount',
		  	qs: { account_no: req.body.target_account_no },
		  	headers: app.get('request_headers')
	     };

	    request(options, function (error, response, body) {
			if (error) return console.error('Failed: %s', error.message);
			var json_data = JSON.parse(body);
			if(!json_data.httpCode){
				res.send({
					"account_no" : json_data[0].account_no,
					"currency" : json_data[0].currency,
					"status": 1
				});
			}else{
				res.send({"status" : 0});
			}
		});
	});

	app.post('/transfer', function(req, res){
		var options = { 
			method: 'POST',
		  	url: app.get('rest_url') + '/RESTs/transfer',
		  	headers: app.get('request_headers'),
		  	json: true,
		  	body: req.body
	     };

	    request(options, function (error, response, body) {
			if (error) return console.error('Failed: %s', error.message);
			var json_data = body;
			if(!json_data.httpCode){
				res.send({
					"result" : json_data,
					"status": 1
				});
			}else{
				res.send({"status" : 0});
			}
		});
	});

	app.post('/payment',function(req, res){
		var options = { 
			method: 'POST',
		  	url: app.get('rest_url') + '/RESTs/payment',
		  	headers: app.get('request_headers'),
		  	json: true,
		  	body: req.body
	     };

	    request(options, function (error, response, body) {
			if (error) return console.error('Failed: %s', error.message);
			var json_data = body;
			if(!json_data.httpCode){
				res.send({
					"result" : json_data,
					"status": 1
				});
			}else{
				res.send({"status" : 0});
			}
		});
	});

	app.get('/account', function(req, res){
		var page = {
			title: 'Online Banking | Account Page',
			name: 'Account Page',
			portal_name: 'Online Banking'
		};
		if(req.session.login){
			var page_nav = app.get('navigation');
			page_nav[0].active = 1;
			page_nav[1].active = 0;
			page_nav[2].active = 0;
			page_nav[3].active = 0;
			page_nav[4].active = 0;
			page_nav[5].active = 0;
			page_nav[6].active = 0;

			var options = { 
				method: 'GET',
			  	url: app.get('rest_url') + '/RESTs/getAccount',
			  	qs: { account_no: req.session.login.account_no },
			  	headers: app.get('request_headers')
		     };

	     	request(options, function (error, response, body) {
			  if (error) return console.error('Failed: %s', error.message);
				var json_data = JSON.parse(body);
				if(json_data.httpCode){
					res.redirect('/account');
				}else{
					req.session.account_details = json_data;
					res.render('pages/index', {
						page: page,
						nav: page_nav,
						user: ((req.session.login) ? req.session.login : {}),
						details: ((req.session.account_details) ? req.session.account_details : {})
					});
				}
			});
		}else{
			res.redirect('/login');
		}
	});

	app.get('/transfer', function(req, res){
		var page = {
			title: 'Online Banking | Transfer Page',
			name: 'Transfer Page',
			portal_name: 'Online Banking'
		};

		if(!req.session.login){
			res.redirect('/login');
		}else if(!req.session.account_details){
			res.redirect('/account');
		}else{
			var page_nav = app.get('navigation');
			page_nav[0].active = 0;
			page_nav[1].active = 1;
			page_nav[2].active = 0;
			page_nav[3].active = 0;
			page_nav[4].active = 0;
			page_nav[5].active = 0;
			page_nav[6].active = 0;

			res.render('pages/transfer', {
				page: page,
				nav: page_nav,
				user: ((req.session.login) ? req.session.login : {}),
				details: ((req.session.account_details) ? req.session.account_details : {})
			});
		}
	});

	app.get('/payment', function(req, res){
		var page = {
			title: 'Online Banking | Payment Page',
			name: 'Payment Page',
			portal_name: 'Online Banking'
		};

		if(!req.session.login){
			res.redirect('/login');
		}else if(!req.session.account_details){
			res.redirect('/account');
		}else{
			var page_nav = app.get('navigation');
			page_nav[0].active = 0;
			page_nav[1].active = 0;
			page_nav[2].active = 1;
			page_nav[3].active = 0;
			page_nav[4].active = 0;
			page_nav[5].active = 0;
			page_nav[6].active = 0;

			res.render('pages/payment', {
				page: page,
				nav: page_nav,
				user: ((req.session.login) ? req.session.login : {}),
				details: ((req.session.account_details) ? req.session.account_details : {})
			});
		}
	});

	app.get('/branches', function(req, res){
		var page = {
			title: 'Online Banking | Branches Page',
			name: 'Branches Page',
			portal_name: 'Online Banking'
		};

		if(!req.session.login){
			res.redirect('/login');
		}else if(!req.session.account_details){
			res.redirect('/account');
		}else{

			var options = { 
				method: 'GET',
			  	url: app.get('rest_url') + '/RESTs/getBranches',
			  	headers: app.get('request_headers')
		     };

	     	request(options, function (error, response, body) {
			  if (error) return console.error('Failed: %s', error.message);
				var json_data = JSON.parse(body);
				if(json_data.httpCode){
					res.redirect('/account');
				}else{
					var page_nav = app.get('navigation');
					page_nav[0].active = 0;
					page_nav[1].active = 0;
					page_nav[2].active = 0;
					page_nav[3].active = 1;
					page_nav[4].active = 0;
					page_nav[5].active = 0;
					page_nav[6].active = 0;

					res.render('pages/branches', {
						page: page,
						nav: page_nav,
						user: ((req.session.login) ? req.session.login : {}),
						details: ((req.session.account_details) ? req.session.account_details : {}),
						branches: json_data
					});
				}
			});
		}
	});

	app.get('/atms', function(req, res){
		var page = {
			title: 'Online Banking | ATMs Page',
			name: 'ATMs Page',
			portal_name: 'Online Banking'
		};

		if(!req.session.login){
			res.redirect('/login');
		}else if(!req.session.account_details){
			res.redirect('/account');
		}else{

			var options = { 
				method: 'GET',
			  	url: app.get('rest_url') + '/RESTs/getATMs',
			  	headers: app.get('request_headers')
		     };

	     	request(options, function (error, response, body) {
			  if (error) return console.error('Failed: %s', error.message);
				var json_data = JSON.parse(body);
				if(json_data.httpCode){
					res.redirect('/account');
				}else{
					var page_nav = app.get('navigation');
					page_nav[0].active = 0;
					page_nav[1].active = 0;
					page_nav[2].active = 0;
					page_nav[3].active = 0;
					page_nav[4].active = 1;
					page_nav[5].active = 0;
					page_nav[6].active = 0;

					res.render('pages/atms', {
						page: page,
						nav: page_nav,
						user: ((req.session.login) ? req.session.login : {}),
						details: ((req.session.account_details) ? req.session.account_details : {}),
						atms: json_data
					});
				}
			});
		}
	});

	app.get('/loan', function(req, res){
		var page = {
			title: 'Online Banking | Loan Calculator Page',
			name: 'Loan Calculator Page',
			portal_name: 'Online Banking'
		};

		if(!req.session.login){
			res.redirect('/login');
		}else if(!req.session.account_details){
			res.redirect('/account');
		}else{

			var page_nav = app.get('navigation');
			page_nav[0].active = 0;
			page_nav[1].active = 0;
			page_nav[2].active = 0;
			page_nav[3].active = 0;
			page_nav[4].active = 0;
			page_nav[5].active = 1;
			page_nav[6].active = 0;

			res.render('pages/loan', {
				page: page,
				nav: page_nav,
				user: ((req.session.login) ? req.session.login : {}),
				details: ((req.session.account_details) ? req.session.account_details : {})
			});
		}
	});

	app.post('/loan', function(req, res){
		var options = { 
			method: 'GET',
		  	url: app.get('rest_url') + '/Loans/compute',
		  	qs: req.body,
		  	headers: app.get('request_headers')
	     };

     	request(options, function (error, response, body) {
		  if (error) return console.error('Failed: %s', error.message);
			var json_data = JSON.parse(body);
			if(json_data.httpCode){
				res.send({
					status: 0,
					qs: req.query
				});
			}else{
				res.send({
					result: json_data,
					status: 1,
					qs: req.query
				});
			}
		});
	});
}
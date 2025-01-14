var express = require('express');
const crypto = require('crypto');
var bend = require('../public/javascripts/backend');
var router = express.Router();
var app = express();

//GETS
router.get('/', function(req, res, next) {
  	res.sendFile('login.html', { root: "public" } );
});

//POSTS
router.post('/public/getfood/', function(req, res){
	bend.getFood(req.body.foodtype).then((value) => {
		if(value){
			res.send(value);
		}
		else{
			res.send("foodnotfound");
		}
	});
});

router.post('/public/getorder/', function(req, res){
	bend.getorder(req.body.number).then((value) => {
		if(value){
			//res.send(value);
			res.send({order : value.order, tgnotes : value.notes});
		}
		else{
			res.send("ordernotfound");
		}
	});
});

router.post('/public/completeorder/', function(req, res){
	bend.completeorder(req.body.table, req.body.isserved);
	res.send('ok');
});

router.post('/public/removetable/', function(req, res){
	bend.removetable(req.body.tablenumber);
	res.send('ok');
});

router.post('/public/settoseen/', function(req, res){
	bend.settoseen(req.body.tablenumber, req.body.whosaw);
	res.send('ok');
});

router.post('/public/alertseen/', function(req, res){
	bend.alertseen(req.body.tablenumber, req.body.whosaw);
	res.send('ok');
});
router.post('/public/setkitchenstate/', function (req, res) {
	bend.setkitchenstate(req.body.tablenumber, req.body.whosaw, req.body.state);
	res.send('ok');
});
router.post('/public/storenewprice/', function(req, res){
	console.log("1");
	bend.storenewprice(req.body.tablenumber, req.body.foodname, req.body.category, req.body.newprice);
	res.send('ok');
});

router.post('/public/requestcheck/', function(req, res){
	bend.requestcheck(req.body.tablenumber);
	res.send('ok');
});

router.post('/public/gettables/', function(req, res){
	bend.getTables().then((value) => {
		if(value){
			res.send(value);
		}
		else{
			res.send("table not found");
		}
	});
});

//Security
router.post('/public/requestlogin/', function(req, res){
	//Password hashing to compare to hashed password stored on the db, usage of one way hashing algorithm
	let hashpass = crypto.createHash('sha256').update(req.body.pass).digest('hex');
	
	bend.login(req.body.usrn, hashpass).then((value) => {
		if(value){
			req.session.user = value.username;
			req.session.role = value.role;
			res.send({page : "waiter", answer : "ok"});
		}
		else{
			res.send({page : "login", answer : "kick"});
		}
		
	});
	
});

router.post('/public/logout/', function(req, res){
	req.session.reset();
	res.send({answer : "ok", page : "login"});
});

router.post('/public/askauth/', function(req, res){
	let user = req.session.user;
	let role = req.session.role;
	if(user){
		res.send({answer : "ok" , username : user, userrole : role});
	}
	else{
		res.send({answer : "kick", page : "login"});
	}
});

module.exports = router;
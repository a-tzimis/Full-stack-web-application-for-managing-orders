const MongoClient = require('mongodb').MongoClient;

exports.login = function(usrn, password){
	const dbpromise = new Promise((resolve, reject) => {
  		var url = "mongodb://localhost:27017/";
		const client = new MongoClient(url, { useNewUrlParser: true });
		
		client.connect((err => {
			const collection = client.db("verna").collection("team");
			collection.findOne({ $and: [ {name:usrn}, {pass:password} ] }, (err, result) => {
				if(err) throw err;
				let username = null;
				let password = null;
				let role = null;
				if(result != null){
					username = result.name;
	        		password = result.pass;
	        		role = result.role;
	        	}
	        	else{
	        		resolve(null);
	        	}
        		if (username && password && role) resolve({username, password, role});
        		else reject({Error: 'something went wrong'});
			});
			client.close();
		}));
		
	});
	dbpromise.then((err, result) => {
    	if (err) console.log(err);
    		return result;
  	});

  	return dbpromise;
};
exports.removetable = function(tablenumber){
	var url = "mongodb://localhost:27017/";
	const client = new MongoClient(url, { useNewUrlParser: true });
	let index;
		
	client.connect((err => {
		const collection = client.db("verna").collection("tables");
		try{
			collection.deleteOne({tnumber : tablenumber} , write_concern = {'w':1});
		}catch(e){
			console.log(e);
		}
		client.close();
	}));
};

exports.completeorder = function(table){
	var url = "mongodb://localhost:27017/";
	const client = new MongoClient(url, { useNewUrlParser: true });
		
	client.connect((err => {
		const collection = client.db("verna").collection("tables");
		try {
   			collection.updateOne(
		      { "tnumber" : table.tnumber },
		      { 
		      	$set: {'torder' : table.torder, 'tgnotes' : table.tgnotes , 'talert' : table.talert},
		      	$setOnInsert: {'tpeople' : table.tpeople , 'tnew' : table.tnew , 'ttime' : table.ttime ,'tstartersserved' : table.tstartersserved , 'tmainsserved' : table.tmainsserved}
		      },
		      { w: "majority", wtimeout: 5000 , upsert : true}
   			)

		}catch(e){
			console.log(e);
		}
		client.close();
	}));
};

exports.settoseen = function(tablenumber, role){
	var url = "mongodb://localhost:27017/";
	const client = new MongoClient(url, { useNewUrlParser: true });
	let index;
		
	client.connect((err => {
		const collection = client.db("verna").collection("tables");
		if(role == 'boufe'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "tnew.0" : false } }  , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		else if(role == 'kitchen'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "tnew.1" : false } } , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		client.close();
	}));
};

exports.alertseen = function(tablenumber, role){
	var url = "mongodb://localhost:27017/";
	const client = new MongoClient(url, { useNewUrlParser: true });
	let index;
		
	client.connect((err => {
		const collection = client.db("verna").collection("tables");
		if(role == 'boufe'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "talert.0" : false } }  , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		else if(role == 'kitchen'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "talert.1" : false } } , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		else if(role == 'waiter'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "talert.2" : false } } , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		else if(role == 'owner'){
			try {
				collection.updateOne({tnumber : tablenumber} , { $set: { "talert.3" : false } } , write_concern = {'w':1});
			}catch(e){
				console.log(e);
			}
		}
		client.close();
	}));
};

exports.requestcheck = function(tablenumber){
	var url = "mongodb://localhost:27017/";
	const client = new MongoClient(url, { useNewUrlParser: true });

	client.connect((err => {
		const collection = client.db("verna").collection("tables");
		try {
			collection.updateMany({tnumber : tablenumber} , { $set: { "talert.4" : "requestcheck" , "talert.0" : false , "talert.1" : false, "talert.2" : true , "talert.3" : true} }  , write_concern = {'w':1});
		}catch(e){
			console.log(e);
		}
		client.close();
	}));
};

exports.storenewprice = function(tablenumber, foodname, category, newprice){
	const dbpromise = new Promise((resolve, reject) => {
		var url = "mongodb://localhost:27017/";
		const client = new MongoClient(url, { useNewUrlParser: true });
	
	
		client.connect((err => {
			const collection = client.db("verna").collection("tables");
			collection.findOne({'tnumber':tablenumber}).then(function(table){
				let i;
				if(category == "starters"){
					for(i=0; i<table.torder[0].length; i++){
						if(table.torder[0][i].fname == foodname){
							table.torder[0][i].fprice = newprice;
						}
					}
				}
				else if(category == "maincourses"){
					for(i=0; i<table.torder[1].length; i++){
						if(table.torder[1][i].fname == foodname){
							table.torder[1][i].fprice = newprice;
						}
					}
				}
				else if(category == "rest"){
					for(i=0; i<table.torder[2].length; i++){
						if(table.torder[2][i].fname == foodname){
							table.torder[2][i].fprice = newprice;
						}
					}
				}
				//Update table with new order
				collection.updateOne({'tnumber' : tablenumber} , { $set: { 'torder' : table.torder } } , write_concern = {'w':1});
				client.close();
			});
		}));
	});
	dbpromise.then((err, result) => {
    	if (err) console.log(err);
    		return result;
  	});
	return dbpromise;
};


exports.getTables = function(){
	const dbpromise = new Promise((resolve, reject) => {
  		var url = "mongodb://localhost:27017/";
		const client = new MongoClient(url, { useNewUrlParser: true });
		
		client.connect((err => {
			const collection = client.db("verna").collection("tables");
			collection.find((err, result) => {
				if(err) throw err;
				var tables = {};
				if(result != null){
					tables = result.toArray();
	        	}
	        	else{
	        		resolve(null);
	        	}
        		if (tables) resolve(tables);
        		else reject({Error: 'something went wrong'});
			
			});
			client.close();
		}));
	});
	dbpromise.then((err, result) => {
    	if (err) console.log(err);
    		return result;
  	});
	return dbpromise;
};

exports.getorder = function(number){
	const dbpromise = new Promise((resolve, reject) => {
  		var url = "mongodb://localhost:27017/";
		const client = new MongoClient(url, { useNewUrlParser: true });
		
		client.connect((err => {
			const collection = client.db("verna").collection("tables");
			collection.findOne({tnumber: number}, (err, result) => {
				if(err) throw err;
				let order;
				let notes;
				if(result != null){
				    let	starters = result.torder[0];
				    let maincourses = result.torder[1];
				    let rest = result.torder[2];
				    notes = result.tgnotes;
					order = starters.concat(maincourses,rest);
	        	}
	        	else{
	        		resolve(null);
	        	}
        		if (order) resolve({order,notes});
        		else reject({Error: 'something went wrong'});
			
			});
			client.close();
		}));
	});
	dbpromise.then((err, result) => {
    	if (err) console.log(err);
    		return result;
  	});
	return dbpromise;
};

exports.getFood = function(type){
	const dbpromise = new Promise((resolve, reject) => {
  		var url = "mongodb://localhost:27017/";
		const client = new MongoClient(url, { useNewUrlParser: true });
		
		client.connect((err => {
			const collection = client.db("verna").collection("menu");
			collection.find({ftype: type}, (err, result) => {
				if(err) throw err;
				var fooditems = {};
				if(result != null){
					fooditems = result.toArray();
	        	}
	        	else{
	        		resolve(null);
	        	}
        		if (fooditems) resolve(fooditems);
        		else reject({Error: 'something went wrong'});
			
			});
			client.close();
		}));
	});
	dbpromise.then((err, result) => {
    	if (err) console.log(err);
    		return result;
  	});
	return dbpromise;
};



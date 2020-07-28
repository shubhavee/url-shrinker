var express = require('express');
var router = express.Router();
var User = require('../models/user');

var ShortUrl = require('../models/shortUrl');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/forgetpass', function (req, res, next) {
	return res.render('forget.ejs');
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});

});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){

			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});

			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/logout', function (req, res, next) {

	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
				console.log("oooops")
    		return next(err);
    	} else {
    		return res.redirect('/');
				// return res.render('index.ejs');
    	}
    });
}

});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},async function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			const shortUrls=await ShortUrl.find({email:data.email})
			return res.render('data.ejs', {"name":data.username,"email":data.email,"shortUrls":shortUrls});
		}
	});
});



router.post('/shortUrls', function(req, res, next) {
	console.log(req.body);
	var urlInfo = req.body;

	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);

		var newUrl = new ShortUrl({
			// unique_id:c,
			email:data.email,
			full: urlInfo.fullUrl,
		});
		newUrl.save(function(err, Url){
			if(err)
				console.log(err);
			else
				console.log('Success');
		});

		res.redirect('/profile')

	});

});


router.get('/:shortUrl', async (req,res)=>{
  const shortUrl= await ShortUrl.findOne({short: req.params.shortUrl})

  if (shortUrl==null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})


module.exports = router;

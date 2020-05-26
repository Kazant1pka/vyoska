const express = require('express');
const mongoose = require('mongoose');

const algoliasearch = require('algoliasearch');
const algoliaClient = algoliasearch('2020', 'search');

const fileUpload = require('express-fileupload');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session')
var MongoStore = require('connect-mongo')(session);

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;

const _ = require("lodash");
const jwt = require('jsonwebtoken');


const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bodyParser = require('body-parser')
const app = express()


const url = 'mongodb://localhost/Vyoska';

const User = require('./model/user');
const Article = require('./model/article');
const Comment = require('./model/comment');
const News = require('./model/news');
const Institution = require('./model/institutions');

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
	console.log('payload received', jwt_payload);
	// usually this would be a database call:
	var user = users[_.findIndex(users, { id: jwt_payload.id })];
	if (user) {
		next(null, user);
	} else {
		next(null, false);
	}
});

passport.use(strategy);
passport.use(new GoogleStrategy({
	clientID: '904904826428-n18ki2oqvr4kpo5fiu6hnueuohubomcu.apps.googleusercontent.com',
	clientSecret: 'H4SLKBRR2vMHgaSZZdrpi2le',
	callbackURL: "/auth/google/callback"
},
	function (accessToken, refreshToken, profile, done) {
		User.findOrCreate({ googleId: req.body._id }, function (err, user) {
			return done(err, user);
		});
	}
));
passport.use(new VKontakteStrategy({
	clientID: '7329746', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
	// clientSecret: VKONTAKTE_APP_SECRET,
	callbackURL: "http://localhost:3000/auth/vkontakte/callback"
},
	function (accessToken, refreshToken, params, profile, done) {
		// console.log(params.email); // getting the email
		User.findOrCreate({ vkontakteId: req.body._id }, function (err, user) {
			return done(err, user);
		});
	}
));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
	secret: 'my express secret',
	saveUninitialized: false,
	resave: true,
	cookie: {
		expires: 9000000,
	},
	store: new MongoStore({
		url: 'mongodb://localhost/Vyoska',
	})
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/api/user/authBasic', function (req, res, next) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (req.session.user) {
			{
				User.find({ _id: req.session.user.id }, [], (err, doc) => {
					if (err) throw err;
					return res.status(200).json(doc[0])
				})
			}
		} else {
			return null
		}
	});
})

app.post('/api/user/auth', function (req, res, next) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		User.find({
			email: req.body.email
		}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return doc
		})
	});
})

app.get('/api/user/logout', function (req, res, next) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		return req.session.destroy()
	})
});

app.post('/api/user/login', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true }, function (err) {
		if (err) throw err;
		User.find({
			email: req.body.email, password: req.body.password
		}, function (err, user) {
			if (err) throw err;
			if (user.length === 1) {
				req.session.user = { id: user[0]._id, email: user[0].email, photoUrl: user[0].photoUrl, username: user[0].username }
				const payload = { id: req.body.email }
				const token = jwt.sign(payload, jwtOptions.secretOrKey, {
					expiresIn: '9000'
				})
				return res.status(200).json({
					status: 'success',
					token: token,
					data: user[0]
				})
			} else {
				return res.status(200).json({
					status: 'fail',
					message: 'Login Failed'
				})
			}

		})
	});
})


app.post('/api/user/create', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {

		if (err) throw err;
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			photoUrl: 'https://evasion-music.com/assets/artist-placeholder-d7afecb17fc3fba88e3bae710cee68359efd9263cdd6d25c1027889daa9745f8.png',
			status: req.body.status
		})
		user.save((err, doc) => {
			req.session.user = { id: doc._id, email: doc.email, photoUrl: doc.photoUrl, username: doc.username }
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})

app.post('/api/article/create', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		const article = new Article({
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			startDate: new Date(Date.now()),
			tag: req.body.tag,
			comment: [],
			rating: 0,
			like : 0,
			bookmark: 0,
			creator: req.session.user.username
		});

		article.save((err, doc) => {
			User.findByIdAndUpdate(req.session.user.id, { $push: { createdArticle: doc._id } }, (err, pls) => {
				if (err) throw err;
			});
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		});

	});
})

app.post('/api/article/edit', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate({ _id: req.body._id }, {
			$set: {
				title: req.body.title,
				description: req.body.description,
				category: req.body.category,
				tag: req.body.tag,
				editDate: new Date(Date.now())
			},
		}, (err, pls) => {
			if (err) throw err;
		});
		if (err) throw err;
		return res.status(200).json({
			status: 'success',
			data: doc
		})
	});
});
app.post('/api/user/edit', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		User.findByIdAndUpdate(req.session.user.id, {
			$set: {
				username: req.body.username,
				email: req.body.email,
				subject: req.body.subject,
			},
		}, (err, pls) => {
			if (err) throw err;
		});
		if (err) throw err;
		return res.status(200).json({
			status: 'success'
		})
	});
});
app.post('/api/admin/get', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		User.findByIdAndUpdate(_id, {
			$set: {
				status: 'Администратор'
			},
		}, (err, pls) => {
			if (err) throw err;
		});
		if (err) throw err;
		return res.status(200).json({
			status: 'success'
		})
	});
});

app.post('/api/admin/del', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		User.findByIdAndUpdate(_id, {
			$set: {
				status: 'Пользователь'
			},
		}, (err, pls) => {
			if (err) throw err;
		});
		if (err) throw err;
		return res.status(200).json({
			status: 'success'
		})
	});
});


app.post('/api/article/delete', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		Article.findByIdAndDelete({ _id: req.body._id }, (err, pls) => {
			if (err) throw err;
		});
		User.findOneAndUpdate(req.session.user.id, { $pull: { createdArticle: {_id:req.body._id} } }, {multi:true}, (err, pls) => {
			if (err) throw err;
			return res.status(200).json({ status: "success" })
		});
		if (err) throw err;
	});

});

app.post('/api/article/rating', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		const rating = new Object({
			idC: req.body.idC,
			mark: req.body.mark
		});
		User.findOneAndUpdate(req.session.user._id, { $pull: { likedArticle: { idC: req.body.idC } } }, (err, pls) => { });
		User.findOneAndUpdate(req.session.user._id, { $push: { likedArticle: rating } }, (err, pls) => { });
		Article.findByIdAndUpdate(req.body.idC, { $pull: { rating: { idU: req.session.user.id } } }, (err, pls) => { if (err) throw err; });
		Article.findByIdAndUpdate(req.body.idC, { $push: { rating: { idU: req.session.user.id, mark: req.body.mark } } }, (err, pls) => { if (err) throw err; });
	});
})
app.post('/api/article/comment/like', (req, res) => {
	mongoose.connect(url, { useMongoClient: true, useUnifiedTopology: true }, function (err, doc) {
		if (err) throw err;
		
		Comment.findByIdAndUpdate({ _id: req.body._id }, { $push: { like: req.session.user.id } }, (err, pls) => { });
		Article.findByIdAndUpdate(req.body.idx,{comment: {_id:req.body.comment._id}}, (err, doc) => {
			Comment.findByIdAndUpdate(req.body._id, {}, (err, pls) => { 
				if (err) throw err;
				return res.status(200).json({status:'succes', data: doc})
			});
		});
	});
})
app.post('/api/article/comment/dislike', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err, doc) {
		if (err) throw err;
		Comment.findOneAndUpdate(req.body._id, { $pull: { dislike: req.session.user.id } }, (err, pls) => { });
		Comment.findOneAndUpdate(req.body._id, { $push: { dislike: req.session.user.id } }, (err, pls) => { });
	});
})

app.post('/api/article/getArticle', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Article.find({}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})

app.post('/api/article/getRatingArticle', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;

		Article.aggregate([{ $project: { total: { $sum: '$rating.mark' } } }, { $addFields: { rate: { $divide: ["$total", 'rating'.length] } } }], (err, pls) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				dataasd: pls
			})
		})

	});
})
app.post('/api/article/getCategoryArticle', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Article.find({
			category: req.body.category
		}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})

app.post('/api/article/getCreatorArticle', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Article.find({
			creator: req.body.creator
		}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})

app.post('/api/article', function (req, res) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		Article.find({ _id: req.body._id }, [], (err, doc) => {
			if (err) throw err;
			return res.status(200).send(doc)
		})
	});
})
app.post('/api/institution', function (req, res) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Institution.find({
			name: req.body.name
		}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})
app.post('/api/user', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		User.find({}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
})

app.post('/api/article/news', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Article.find({
			_id: req.body._id
		}, { news: 1, _id: 0 }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json(doc[0])
		})
	});
})

app.post('/api/article/addNews', function (req, res) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		const news = new News({
			title: req.body.title,
			text: req.body.text,
			img: req.body.img,
			date: req.body.date
		})
		Article.findByIdAndUpdate({ _id: req.body._id }, { $push: { news: news } }, (err, pls) => {
			if (err) throw err;
		});
	})
});
app.post('/api/article/news/delete', function (req, res) {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		Article.findOneAndUpdate('idN', {}, (err, pls) => {
			News.findOneAndRemove('_id', {}, (err, doc) => {
			})
			if (err) throw err;
			return res.status(200).json(
				{
					status: "success",
					data: pls
				}
			)
		});
	})
});


app.put('/api//addcomment', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		const comment = new Comment({
			title: req.body.title,
			senderId: req.session.user.id,
			senderName: req.session.user.username,
			senderUrl: req.session.user.photoUrl,
			createdAt: req.body.createdAt
		})
		Article.findByIdAndUpdate({ _id: req.body._id }, { $push: { comment: comment } }, (err, pls) => {
			if (err) throw err;
		});
	})

})

app.post('/api/article/comments', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Article.find({
			_id: req.body._id
		}, { comment: 1, _id: 0 }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json(doc[0])
		})
	});
})

app.put('/api/article/delComment/', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		Aricle.findOne({ _id: req.body.id(_id) }, (err, pls) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'success',
				data: pls
			})
		});
	})
})

app.listen(3000, () => console.log('Blog server running on port 3000!'))
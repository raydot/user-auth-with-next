// api/dev.js

/*
	This is a small server using basic routing that runs on micro-dev
	as a development dependency.  This helps the app run local
*/

const { run, send } = require("micro")
const login = require("./login")
const profile = require("./profile")

const dev = async(req, res) => {
	switch (req.url) {
		case "/api/profile.js":
			await profile(req, res);
			break;
		case "/api/login.js":
			await login(req, res);
			break;

		default: 
			send(res, 404, "404.  So not found.");
			break;
	}
};

exports.default = (req, res) => run(req, res, dev)

// The server will return the functions when a specific URL is requested.
// This is a big unconventional for routing, but it works for our example.
import express from "express";
import admin from "firebase-admin";
import router from "routes/router";

// - Express
const app = express();
const port = 3000;

async function startServer() {
	admin.initializeApp();			// initialize Firebase SDK
	app.use(express.json());		// parse request body as json
	app.use(router);				// assign routes

	app.listen( port, () => {
		console.log( `Server is running at port ${port}` );
	})
}

startServer();
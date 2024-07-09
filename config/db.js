const mongoose = require('mongoose');
require('dotenv').config();
module.exports = async (dburl) => {
	try {
		await mongoose.connect(dburl, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB Connected .....');
	} catch (e) {
		console.log(e);
		console.log('Refused to connect....');
	}
};

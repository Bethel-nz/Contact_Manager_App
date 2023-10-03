const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, '..', '/db', 'data.json');

const writeToFile = (data) => {
	const jsonData = JSON.stringify(data);
	fs.writeFileSync(fullPath, jsonData, 'utf-8')
}

module.exports = { writeToFile }
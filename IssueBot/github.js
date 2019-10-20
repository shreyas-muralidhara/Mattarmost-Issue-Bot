const got  = require('got');
const token = "token " + "YOUR TOKEN";
const urlRoot = "https://api.github.com";

async function getIssuesSince(owner, repo) {
	const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues";
	const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		},
		json: true
	};

	// Send a http request to url
	let issues = (await got(url, options)).body;
	return issues;
}
exports.getIssuesSince = getIssuesSince;

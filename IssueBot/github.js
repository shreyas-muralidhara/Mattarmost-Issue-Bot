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
async function EditIssue(owner,repo,issueNumber,assignees) {
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues/"+issueNumber;
  const postbody = {
  "assignees": assignees
    };
  const options = {
		method: 'PATCH',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		},
    body: JSON.stringify(postbody)
	};
	// Send a http request to url
	let issues = (await got(url, options)).body;
	return issues;
}
async function getCollaborators(owner,repo){
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/collaborators";
	const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		},
		json: true
	};

	// Send a http request to url
	let collaborators = (await got(url, options)).body;
	return collaborators;
}
async function getIssueswithState(owner,repo,state,assignee){
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues?state="+state+"&assignee="+assignee;
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
async function getMilestone(owner,repo){
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/milestones";
  const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		},
		json: true
	};
  // send a http request to urlRoot
  let milestones = (await got(url,options)).body;
  return milestones;
}
async function createIssue(owner,repo,createissue) {
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues/";

  const options = {
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		},
    body: JSON.stringify(createissue)
	};
	// Send a http request to url
	let issues = (await got(url, options)).body;
	return issues;
}

exports.createIssue = createIssue;
exports.getMilestone = getMilestone;
exports.getIssueswithState = getIssueswithState;
exports.getCollaborators = getCollaborators;
exports.getIssuesSince = getIssuesSince;
exports.EditIssue = EditIssue;

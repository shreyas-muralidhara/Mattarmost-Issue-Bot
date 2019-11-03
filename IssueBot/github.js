const got  = require('got');
var config ={}
config.token = "c9733c328dd10d1e815b5e823f33d0e286709960";
const urlRoot = "https://github.ncsu.edu/api/v3";
//https://api.github.com
async function getIssuesSince(owner, repo) {
	const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues";
	const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
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
			"Authorization": `token ${config.token}`
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
			"Authorization": `token ${config.token}`
		},
		json: true
	};
	try{
		let collaborators = (await got(url, options)).body;
		return collaborators;
	}catch(error){
		console.log(error.response.body);
	}
}
async function getIssueswithState(owner,repo,state,assignee){
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues?state="+state+"&assignee="+assignee;
	const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
		},
		json: true
	};
	try{
		let issues = (await got(url, options)).body;
		return issues;
	}catch(error){
		return [];
	}
}
async function getMilestone(owner,repo){
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/milestones";
  const options = {
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
		},
		json: true
	};
  // send a http request to urlRoot
	try{
		let milestones = (await got(url,options)).body;
		return milestones;
	}catch(error){
		return null;
	}
}
async function createIssue(owner,repo,createissue) {
  const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues/";

  const options = {
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
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

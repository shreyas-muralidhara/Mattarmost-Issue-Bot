const Client = require('mattermost-client');
const _ = require("underscore");
// see about this !!!
const github = require("./github.js");
const nock = require("nock");
// hardcoded
let host = "127.0.0.1:8065"
let group = "se-team"
let bot_name = "testbot";
let client = new Client(host, group, {});
let repo = "Hello-World";
//
const data = require("./mock.json");

async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);

    setInterval(staleIssues,60000);
    client.on('message', function(msg)
    {
        console.log(msg);
        if( hears(msg, "weather") )
        {
            console.log(client.getAllChannels());
            parseMessage(msg);
            //staleIssues(msg);
          }

    });

}

function hears(msg, text)
{
    if( msg.data.sender_name == bot_name) return false;
    if( msg.data.post )
    {

        let post = JSON.parse(msg.data.post);
        if( post.message.indexOf(text) >= 0)
        {
            return true;
        }
    }
    return false;
}
// issue label change is required
async function staleIssues(){
  //let channel = msg.broadcast.channel_id;
  let channel = 'mio4szxojfy77xchadxbmhsd1w';
  // Mocking service
  const issue0 = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/issues")
      .reply(200, JSON.stringify(data));

  let issues = await github.getIssuesSince("testuser",repo);

  var issueList = []
  // curr time
  let currTime = new Date().getTime()
  for (var i = 0; i < issues.length; i++) {
    if(currTime-new Date(issues[i].updated_at).getTime()> 24*60*60*1000){
    issueList.push(issues[i].title);
    console.log(issues[i].title);
  }
  }
  if(issueList.length > 0){
    var msg = "";
    for (var i = 0; i < issueList.length; i++) {
      msg = msg+issueList[i]+","
    }
    client.postMessage(msg,channel);
  }
}

async function parseMessage(msg)
{
    let channel = msg.broadcast.channel_id;
    let w = await weather.getWeather().catch( err => client.postMessage("Weather service is down. Sorry!", channel) );
    if( w )
    {
        client.postMessage(w, channel);
    }
}
// async function parseMsg(msg){
//   let channel = msg.broadcast.channel_id;
//   client.postMessage("Can you give me the lat and lon of the location ?",channel);
// }
// async function latlonData(msg){
//   let post = JSON.parse(msg.data.post);
//   let message = post.message;
//   console.log(message);
//   var res = message.split(" ");
//   let channel = msg.broadcast.channel_id;
//   //console.log(res);
//   let w = await weather.getWeather(res[1],res[2]).catch( err => client.postMessage("Weather service is down. Sorry!", channel) );
//   if( w )
//   {
//       client.postMessage(w, channel);
//   }
// }
(async () =>
{

    await main();

})()

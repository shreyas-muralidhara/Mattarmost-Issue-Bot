const Client = require('mattermost-client');
const _ = require("underscore");
// see about this !!!
const github = require("./github.js");
const case1 = require("./case1.js");
const case2 = require("./case2.js")
const Case3  = require("./case3.js");

const nock = require("nock");
// hardcoded
let host = process.env.MMHOST;
let group = process.env.MMGROUP;
let bot_name = process.env.MMBOTNAME;
let client = new Client(host, group, {});
let repo = process.env.MMREPO;
let botEmail = process.env.MMBOTMAIL;
// Handle all of them with a config file or process.env
const data = require("./mock.json");

async function main()
{
    console.log(process.env.BOTTOKEN);
    let request = await client.tokenLogin(process.env.BOTTOKEN);
    //setInterval(case2.staleIssuesBot,60000,client);
    let case3=null;
    client.on('message', function(msg)
    {
          console.log(msg);
          if( hears(msg, "Reassign") )
          {
            case2.staleIssuesUser(msg,client);
          }
          else if(hears(msg,"I have a"))
          {
            case3 = new Case3(client);
            case3.createIssue(msg);
          }
          else if(hears(msg,"Attributes")){
            if(case3!=null){
            case3.getAttributes(msg);
          }
          }else if(hears(msg,"Assign")){
            if(case3!=null){
            case3.createAPI(msg);
          }
            case3 = null;
          }else if( hears(msg, "display list of open issues"))
          {
            case1.getPriority(msg,client);
          }
          else if( hears(msg, "update the priority for "))
          {
            case1.updatePrio(msg,client);
          }
          else if( hears(msg, "change issue priority"))
          {
            var print = "";
            print += "Issue label updated";
            client.postMessage(print,msg.broadcast.channel_id);
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


////////////
(async () =>
{

    await main();

})()

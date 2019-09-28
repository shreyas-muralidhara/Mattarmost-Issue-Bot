# Design Milestone 

In this milestone, we are providing a design proposal for Software Engineering **Issue Bot**. Our design proposal will include description for the following items: 

## Problem Statement:
Github is the most popular version control used in Software development lifecycle management.
Issue tracking and management is the most common feature, which is used by software engineers on github platform.
Software Engineers have to perform daily tasks of tracking and maintaining issues, by subscribing to emails and web notifications related to their work repositories.
The implementation of the issue bots should overcome these mundane tasks for the users in issue management lifecycle.
Users interact with the bot in simple phrases, where the user directs specific task to the bot.
Bot triggers the required commands at the backend. This avoids the user to periodically visit github for the follow up of each notification.
The user should have the independence of letting the bot know on what notification he wants to receive. 

## Bot Description:
The Issue Bot is an easy to use bot that helps users in issue maintenance tasks such as:  
* Create Issues using mattermost.
* View  Issues on mattermost by filtering on attributes - tags, authors,milestones etc. 
* Tracking messages in mattermost tagged with an issue ID by adding it as a new comment in git. 
* Escalate stale issues to other team members.
* Send notifications regarding the developments in the issue.
* User can Subscribe/Unsubscribe to notifications for concerned issues.

Bridging the gap between github and mattermost would make project management more efficient. Having these features in our bot helps enhance coordination within the team as a user can easily perform certain tasks from mattermost without having to use the git page and also it helps the developers avoid keeping track of the issues. 

Our Issue Bot is a response to events bot. Our bot falls into the category of chat- Dev Bot since, it acts as a mediator between the people  by sending notifications.

```
USECASE 1: Push comments related to an issue to the git.
1. Pre-conditions:
   The bot needs to be subscribed to the repository. If it is a Private repo the user should be a collaborator/owner of the Repository. 
2. Main Flow: 
   When user types a message tagged with an issue id then the bot will push the messages as comments to that issue in git.
3. Subflows:
   [S1]- The user would type a message tagged with @issue_id.  
   [S2]- The bot will push the message as comment to the issue and return a job status of pass/fail.  
4. Alternative Flow: 
   [E1]- If the issue has already been closed, comments cannot be added to the issue.
```

```
USECASE 2: Creating an issue linked to the pull request
1. Pre-conditions:
   The bot needs to be subscribed to the repository. And the user should be the collaborator/owner of the repository.There should be pull requests initialized in the git repository.	  
2. Main Flow:
   The collaborator of the repository can request the entire list of pull requests which will be displayed by the bot in the following format [Pull request  current status   Action required]. The user can either accept or reject the pull request. If the user rejects the 
   pull request then the bot creates a new issue linked to the pull request with the reason for rejecting the request as specified by the user.
3. Subflows:
   [S1] The collaborator can request to view the pull requests with a message like  @pull_request @bot.  
   [S2] The bot will display the list of pull requests and the user is given an option to review authorized requests.  
   [S3] If the pull request is approved from mattermost it would be approved.  
   [S4] If the pull request is rejected then the bot opens a message bar where the user can type a message which would be used to create a new issue linked to the pull request.                     
4. Alternative Flow: 
   [E1]- If the pull request has been merged with the master and closed. 
```

```
USECASE 3: Stale issues alerts to all team members.
1. Pre-conditions:
   The bot needs to have the access to the repository. There must be some issues existing in the repository. 
2. Main Flow:
   Bot will notify the author and collaborators of the repo of any stale issues by sending a direct message to them. If the member has unsubscribed from the issue, he will not be notified. The owner of the issue can then reassign the stale issue to some other team members.
3. Subflows:
   [S1] Bot will notify the author and the collaborators of the repo of any stale issues.  
   [S2] If some member has unsubscribed from the issue, he will not be notified.  
   [S3] The author can then reassign the stale issue to some other team members.  
4. Alternative Flows:
   [E1] All the collaborators except for the owner of the issue have unsubscribed from the issue.
 ``` 
  
## Design Sketches

#### Wireframes
The following screens display the mock up of **issue bot**, for each of the use case:

* Push comments related to an issue to the git.
![wireframe2](https://media.github.ncsu.edu/user/10687/files/b0c01880-e160-11e9-8688-a5e926b967ca)
	
* Creating an issue linked to the pull request
![wireframe4](https://media.github.ncsu.edu/user/10687/files/5c1c9d80-e160-11e9-9369-ebb3f26c4573)	
	
* Stale issues alerts to all team members.
![wireframe3](https://media.github.ncsu.edu/user/10687/files/368f9400-e160-11e9-9e9b-d647778b19d8)

#### Storyboard
   ![Image Pasted at 2019-9-26 14-44](https://media.github.ncsu.edu/user/10687/files/2f1cba80-e161-11e9-9cb3-653012a12ba7)


## Architecture Design

#### High Level Design

Below diagram displays the high level overview of architectural design - Issue Bot:
![Image Pasted at 2019-9-27 17-35](https://media.github.ncsu.edu/user/10687/files/f1209600-e162-11e9-9e42-16e4dcd60418)

Our Issue bot interacts with following third party services:  
  GitHub  
  Mattermost  

Issue Bot would interact with users through its own Mattermost account.


#### Architectural Compnents

This project involves the usage of following components:  
![Image Pasted at 2019-9-27 18-34](https://media.github.ncsu.edu/user/10687/files/963a6f00-e161-11e9-8f64-e72cb40b0aae)

**Github**- GitHub provides hosting for software development version control using Git.  It provides access control and several collaboration features such as bug tracking, feature requests, task management, and wikis for every project.  Our bot is going to communicate with Github using Github REST API calls.  
**Mattermost**- Mattermost is an open-source, self-hostable online chat service. It is designed as an internal chat for organisations and companies. We will be deploying our bot on Mattermost.  
**IssueBot**- Our IssueBot is going to be the central medium of communication between the user on mattermost and github. User will make requests to the bot on mattermost and the bot will act accordingly. Our bot helps automate the manual tasks for the user.  
**User**- User is going to communicate with the bot through Mattermost. User will request and get response for his activities.  
**Github API Manager**-  Git API Manager is responsible to connect GitHub with the bot. It interacts with GitHub via Rest APIs to accomplish tasks.  
**Mattermost API Manager**- Mattermost  API Manager helps IssueBot and users to communicate effectively. It is used to send and receive data between the Bot App server and users. Bot uses a separate id to communicate on Mattermost.  
**Parser**- When the user types the message we will use a regular expression to grab the intent of the message. In the future, we may add a semantic parser to get more information.  
**Event Manager**- Event manager controls the intervals at which the bot notifies the user of any periodic events or alerts.  
**Bot Engine**- We are using Node.js server as the engine. It comes with an http module that provides a set of functions and classes for building a HTTP server.  

#### Constraints:  
* Issue Bot makes API calls to GitHub and Mattermost. Currently GitHub and Mattermost API are statically incorporated into the functions. Any changes made to the GitHub and Mattermost API will be need to be manually updated in the bot.  
* The Issue Bot can only use GitHub for version control.  
* Currently, the issue bot extracts data from user messages using regular expressions. This can be improved upon by integrating with natural language processing API’s to make the bot more robust.
* Issue Bot can only interact with one user at a time. Handling Pull requests and stale issues (use case 2 &3) need individual interaction. However, comments of multiple users (use case 1) can be pushed at once.
* The Issue Bot assumes that the user is working only on a single Repository. That is, all members of a team are working on a single project.

#### Additional patterns
##### Blackboard:
Our Issue Bot can be designed using the Blackboard pattern. The Issue bot interacts with clients who act as knowledge sources and any request from the client will be processed by the issue bot which performs corresponding operation on Github.

![blackboard](https://media.github.ncsu.edu/user/10687/files/cc77ee80-e161-11e9-87c4-0f346ea45fe6)

##### Event Systems:
Our bot architecture facilitates both explicit and implicit invocation. As an example of implicit invocation, the bot keeps track of conversation on an issue for some time and ask the user if it can push the messages as comments to that issue in git. And as an example for explicit invocation the bot displays the list of pull requests when requested by the user.



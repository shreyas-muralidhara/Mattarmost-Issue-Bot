# Issue Bot - No Issues with Issue Bot 
Problem Statement:
----------
Github is the most popular version control used in Software development lifecycle management.
Issue tracking and management is the most common feature, which is used by software engineers on github platform.
Software Engineers have to perform daily tasks of tracking and maintaining issues, by subscribing to emails and web notifications related to their work repositories.
The implementation of the issue bots should overcome these mundane tasks for the users in issue management lifecycle.
Users interact with the bot in simple phrases, where the user directs specific task to the bot.
Bot triggers the required commands at the backend. This avoids the user to periodically visit github for the follow up of each notification.
The user should have the independence of letting the bot know on what notification he wants to receive. 

Bot Description:
-----------
The Issue Bot is an easy to use bot that helps users in issue maintenance tasks such as:  
* Create Issues using mattermost.
* View  Issues on mattermost by filtering on attributes - tags, authors,milestones etc. 
* Tracking messages in mattermost tagged with an issue ID by adding it as a new comment in git. 
* Escalate stale issues to other team members.
* Send notifications regarding the developments in the issue.
* User can Subscribe/Unsubscribe to notifications for concerned issues.

Bridging the gap between github and mattermost would make project management more efficient. Having these features in our bot helps enhance coordination within the team as a user can easily perform certain tasks from mattermost without having to use the git page and also it helps the developers avoid keeping track of the issues. 

Our Issue Bot is a response to events bot. Our bot falls into the category of chat- Dev Bot since, it acts as a mediator between the people  by sending notifications.

Use Case: Push comments related to an issue to the git.
1. Preconditions:
The bot needs to be subscribed to the repository. If it is a Private repo the user should be a collaborator/owner of the Repository. 

2. Main Flow:
When user types a message tagged with an issue id then the bot will push the messages as comments to that issue in git.

3. Subflows:
[S1]- The user would type a message tagged with @issue_id.  
[S2]- The bot will push the message as comment to the issue and return a job status of pass/fail.  

4. Alternative Flows : 
[E1]- If the issue has already been closed, comments cannot be added to the issue.

Use Case:  Creating an issue linked to the pull request

1. Preconditions:The bot needs to be subscribed to the repository. And the user should be the collaborator/owner of the repository.There should be pull requests initialized in the git repository.
		  
2. Main Flow:
The collaborator of the repository can request the entire list of pull requests which will be displayed by the bot in the following format [Pull request  current status   Action required]. The user can either accept or reject the pull request. If the user rejects the pull request then the bot creates a new issue linked to the pull request with the reason for rejecting the request as specified by the user.

3. Subflows:
[S1] The collaborator can request to view the pull requests with a message like  @pull_request @bot.  
[S2] The bot will display the list of pull requests and the user is given an option to review authorized requests.  
[S3] If the pull request is approved from mattermost it would be approved.  
[S4] If the pull request is rejected then the bot opens a message bar where the user can type a message which would be used to create a new issue linked to the pull request.  
                   
4. Alternative Flows: 
[E1]- If the pull request has been merged with the master and closed. 

Use Case: Stale issues alerts to all team members.

1. Preconditions
   The bot needs to have the access to the repository. There must be some issues existing in the repository. 

2. Main Flow
   Bot will notify the author and collaborators of the repo of any stale issues by sending a direct message to them. If the member has unsubscribed from the issue, he will not be notified. The owner of the issue can then reassign the stale issue to some other team members.

3. Subflows
  [S1] Bot will notify the author and the collaborators of the repo of any stale issues.  
  [S2] If some member has unsubscribed from the issue, he will not be notified.  
  [S3] The author can then reassign the stale issue to some other team members.  

4. Alternative Flows
  [E1] All the collaborators except for the owner of the issue have unsubscribed from the issue.

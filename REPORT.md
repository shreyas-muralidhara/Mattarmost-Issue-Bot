## The problem our bot solved
Let us say we have an application that is being hosted and is open for a community of developers. In the initial phase, we can expect many inputs and a large number of issues to come in. It is not easy to keep a track of all of these issues. So that’s the reason we have our bot that helps in better management of the issues. If there are many open issues, the bot is able to display the priority score for each of them and thus the problem of which issue needs to be worked first is resolved. Another problem that the bot resolves is providing information of stale issues to the owner. Also the task of whom should the new issue be assigned to handled by the bot as it calculates a work-load metric for each user and then comes up a potential team member who can work on that, thus easing the task of distribution of issues. 

Limitations and Future Work

## Features
The Issubot has three primary features:  
**Priority ordering of Issues based on milestone and labels.**  
For all the open issues on repository, bot calculates the priority score for the issue. Priority score is based on the milestone assigned and issue labels - Priority, Status and Issue Type. With the progress of issue status the priority of the issue reduces.  
**Escalate stale issues to other team members.**  
The Bot will notify the owner of the issue about stale issues by sending a direct message . The owner of the issue can then reassign the stale issue to some other team members.  
**Agile planning with Github Issues.**  
The Bot helps identify potential assignees for any new issue being created. To do this the bot takes into consideration the performance of each Team member and estimates based on their current workload if they would be able to complete the issue before its milestone.  

## UseCases

![](usecase1.gif)

![](usecase2.gif)

![](usecase3.gif)

## BOT development Process  

### Design Milestone  
For this milestone we described the problem statement for our bot along with the architecture design we planned to use for the development process. It was challenging to come up with proper UseCases for our IssueBot, but after some consideration we were able to come up with some UseCases followed by feedback from the professor. During this Milestone we also had the opportunity to build Storyboard and Wireframes.   

### Bot Milestone  
During this milestone we modified our UseCases again based on the Professors Feedback. For this milestone we came up with implementation logic for the bot, but we used mock data and did not actually interact with git. The aim of this endeavour was to get a feel of how the final interactions of the bot with users would shape out to be and also focus on our bot logic. We had also done Selenium testing during this milestone. 

### Process Milestone
For this Milestone we created a project board and distributed all tasks equally between the team members. We also started keeping a short note of our team meetings and integrated our bot with git to get a working implementation. During this milestone we also got the opportunity to try out pair programming and found it to be quite effective since it helped us in improving the quality of the code and eliminate the bugs/defects which might have got neglected had there been only one developer working on that task. The most challenging part during this milestone when we started interacting with actual data as the code would often break when edge cases were not handled.       
### Deploy Milestone
For this milestone we have refined our UseCases further and also focused on Deploying our bot on a remote environment. We have written an ansible script to automate bot deployment on a VM running on Ubuntu either in Public Cloud (GCP) or localmachine. In this milestone we hadled all probable edge cases and also configured a Jenkins Server which would create a build on any commit in the git repository. 

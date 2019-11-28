# Milestone: DEPLOYMENT

## Deployment 
Run the following Ansible playbook  
deploySetup.yml: This playbook is responsible for the tasks related to setting up the Issuebot. This installs all the required modules and packages to run the bot, clones the github respository and runs the bot. This playbook also triggers a shell script (environment.sh) which is responsible for setting up the environment variables in the deployed environment. 
Assumption: For successful deployment we are assuming that the user already has mattermost server setup in the VM where playbook 
## Acceptance Test 
 To initiate conversation with scibot
1. Log-in to Mattermost (http://localhost:8085)
2. #?? Enter "seproject17@gmail.com" as the mail id with "SEProject2017" as the password for logging in.
3. #?? If you are logging in as admin please use "seprojecta17@gmail.com" as mail id with "seprojecta2017" as the password.
3. After sucessfully logging-in navigate to issuebot channel and execute the test cases given in the acceptance test plan below.

### UseCase1           
 1)  


### UseCase2 
 1) The bot will display the list of stale issue once everyday (morning) but to ease testing, we have modified the bot to display stale issue list once every 15 mins.  
  Sample Input: -  
  Sample Output:   
  ![Use case2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-896e-fe0cb5583c71)    

 2) Now the user can reassign the issue to another assignee.  
  Trigger Words: Reassign  
  Sample Input: Reassign 37 to sghanta  
  Sample Output: Assignee has been successfully changed  
  ![usecase2 1](https://media.github.ncsu.edu/user/11865/files/8c64c600-1128-11ea-95f2-3c6375643579)

  We have also handled edge cases during this Interaction:  
  If the issue owner tries to reassign the issue to an assignee who does not exist  
   ![usecase2 2](https://media.github.ncsu.edu/user/11865/files/91297a00-1128-11ea-904c-9973cff624b6)  
  If the issue owner tries to reassign an invalid issue id  
   

### UseCase3
1) The user can ask bot to create a new issue (and tag it with a difficulty level). The bot will then request user for other issue attributes to create the issue.
   Trigger Words:
   Sample Input: I have a Hard Issue
   Sample Output:

2) The bot then analyzes the performance metrics of all exisiting users and recommneds a list of users who can complete the task
   Sample Output:
   

3) The user can then ask the bot to assign the issue to a particular assignee.
   Trigger Words:
   Sample Input:
   Sample Output:
   
We have also handled edge cases during this interaction:
If User is trying to assign a Milestone to the issue which does not exist


If the Issue does not have any difficulty level label then it is assumed to be an easy issue for calculating the issue weights.
If a Milestone assigned to an issue does not have a date then it is assumed to be a hard issue.



## Assumptions  
Every issue should have a single assignee.  
Github username and mattermost username should be same.  

## Exploratory Testing and Code Inspection

## Continuous Integration (CI) Server [Bonus]


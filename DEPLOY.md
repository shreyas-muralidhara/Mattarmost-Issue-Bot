# Milestone: DEPLOYMENT

## Deployment 
Run the following Ansible playbook [deploysetup.yml] to deploy the bot on a VM with Ubuntu OS either in local machine or Public Cloud. 
This playbook is responsible for the tasks related to setting up Issuebot. This installs all the required modules, clones the github respository and runs the bot.  
The playbook also runs a shell script [environment.sh] which is responsible for setting the environment variables in the deployed environment.  

## Acceptance Test 
 To initiate conversation with issuebot
1. Log-in to Mattermost (http://34.66.158.171:8065)
2. Enter "sghanta" as the username with "Issuebot@11" as the password for logging in.
3. After sucessfully logging-in navigate to issuebot channel and execute the test cases given in the acceptance test plan below.

We have added the instructor and TAs as collaborators to our "CSC510-11Test" repo. This is currently linked to the mattermost account and any operations performed by the user will reflect in changes in this Repository.   

### UseCase1           



### UseCase2 
 1) The bot will display the list of stale issues to issue owners once every 24 hours.  
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
1) The bot will displau the list of   


## Assumptions  
Every issue should have a single assignee.  
Github username and mattermost username should be same.  


# Exploratory Testing and Code Inspection

# Bonus: Continuous Integration (CI) Server

We created a jenkins server and build job that runs a build job for our bot, including running our integration tests.

CI is ran on a hosted VM.

Our CI works based on a build running from a triggered commit, and also shows build logs of integration tests.


## README FOR THE BOT EXECUTION IN A LOCAL SYSTEM

### CONFIGURATION REQUIRED TO EXECUTE THE BOT

1. Set Host Name
    ex: export MMHOST=127.0.0.1:8065

2. Set Team of Mattermost
    ex: export MMGROUP=se-team

3. Set BotName of Mattermost
    ex: export MMBOTNAME=testbot

4. Set BotEmail
    ex: export MMBOTMAIL=testbot@localhost

5. Set Bot Token
    ex: export BOTTOKEN='bot-token'

6. configure tls settings to accept requests from http server
    export MATTERMOST_TLS_VERIFY=no
    export MATTERMOST_USE_TLS=no

7. Set Git token  
    ex: export GITTOKEN='git-token'

8. Set Repository the team will be linked
    ex: export MMREPO=Hello-World

9. Set Repo owner  
    ex: export GITOWNER='<owner>'

### CONFIGURATION REQUIRED FOR SELENIUM TESTING

1. export USEREMAIL='your email'

2. export USERPASS='your password'

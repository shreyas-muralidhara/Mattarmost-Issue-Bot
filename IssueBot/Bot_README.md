## README FOR THE BOT EXECUTION IN A LOCAL SYSTEM

### CONFIGURATION REQUIRED TO EXECUTE THE BOT

1. Set Host Name
    ex: export MMHOST=127.0.0.1:8065

2. Set Team of Mattermost
    ex: export MMGROUP=se-team

3. Set BotName of Mattermost
    ex: export MMBOTNAME=testbot

4. Set Repository the team will be linked
    ex: export MMREPO=Hello-World

5. Set BotEmail
    ex: export MMBOTMAIL=testbot@localhost

6. Set Bot Token
    ex: export BOTTOKEN='bot-token'

7. configure tls settings to accept requests from http server
    export MATTERMOST_TLS_VERIFY=no
    export MATTERMOST_USE_TLS=no

### CONFIGURATION REQUIRED FOR SELENIUM TESTING

8. export USEREMAIL='your email'

9. export USERPASS='your password'

#!/bin/bash

echo "export MMHOST=127.0.0.1:8065">> /etc/environment 
echo "export MMGROUP=bot" >> /etc/environment
echo "export MMBOTNAME=issuebot" >> /etc/environment
echo "export BOTTOKEN=ub6khmzcx7dgijn1jrzjk77gkr">> /etc/environment
echo "export GITTOKEN=<gittoken>" >> /etc/environment
echo "export MATTERMOST_TLS_VERIFY=no" >> /etc/environment
echo "export MATTERMOST_USE_TLS=no" >> /etc/environment
echo "export MMREPO=Process-Milestone" >> /etc/environment
echo "export GITOWNER=sghanta" >> /etc/environment

source ~/.bashrc

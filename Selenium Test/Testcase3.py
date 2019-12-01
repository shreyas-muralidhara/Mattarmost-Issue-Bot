from  selenium import webdriver
from selenium.webdriver.chrome.options import Options
from  selenium.common.exceptions import TimeoutException
import time
import os

def UseCase3 (Flow):
    time.sleep(10)
    ###
    bottomText = browser.find_element_by_id("post_textbox")
    bottomText.send_keys("recommend assignees who can work on "+"easy"+" issue")
    bottomText.submit()
    time.sleep(1)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if "Sure..." in  (lastfield[len(lastfield)-1].text):
        print ("Successfully asked user for issue attributes")
    else:
        print("Error while requesting user for issue attributes")
        exit(1)
 
    time.sleep(5)
    bottomText = browser.find_element_by_id("post_textbox")
    bottomText.send_keys("title: change mattermost api")
    bottomText.submit()
    bottomText.send_keys("body: This version is causing trouble")
    bottomText.submit()
    bottomText.send_keys("labels: Bug")
    bottomText.submit()
    bottomText.send_keys("milestone: Deployment milestone")
    bottomText.submit()
    bottomText.send_keys("done listing attributes")
    bottomText.submit()
    
    time.sleep(5)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if ("Here are the users" or "No user available") in lastfield[len(lastfield)-1].text:
        print "Successfully displayed list of available users"
    else:
        print "Error while calculation"
        exit(1)
    
    time.sleep(10)
    bottomText = browser.find_element_by_id("post_textbox")
    bottomText.send_keys("assign issue to schippa")
    bottomText.submit()
    time.sleep(1)
    lastfield=[]
    lastfield = browser.find_elements_by_class_name("post-message__text")
    if "created" in  (lastfield[len(lastfield)-1].text):
        print ("Successfully assigned the issue")
    else:
        print("Error while assigning the issue")
        exit(1) 

 
chrome_options = Options()
chrome_options.add_argument("--headless")
browser = webdriver.Chrome('/usr/bin/chromedriver',options=chrome_options)
#browser = webdriver.Chrome('/usr/bin/chromedriver')
browser.get("http://34.66.158.171:8065/bot/messages/@issuebot")
time.sleep(2)
username = browser.find_element_by_id("loginId")
password = browser.find_element_by_id("loginPassword")
submit   = browser.find_element_by_id("loginButton")

username.send_keys('sghanta')
password.send_keys('Issuebot@11')
submit.submit()

#calling functions
Flow=1
UseCase3(Flow)

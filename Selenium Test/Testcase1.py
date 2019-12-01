from  selenium import webdriver
from selenium.webdriver.chrome.options import Options
from  selenium.common.exceptions import TimeoutException
import time
import os
import sys
def UseCase1(Flow):
        
        time.sleep(2)
        ###
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("display list of open issues")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "issues" in  (lastfield[len(lastfield)-1].text):
            sys.stderr.write("Successfully displaying issues")
            exit(1)
        else:
            sys.stderr.write("Error while displaying issues")
            exit(0)
                
        time.sleep(1)
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("update the priority for #999 to Normal")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "exist" in  (lastfield[len(lastfield)-1].text):
            sys.stderr.write("Issue Id does not exist")
        else:
           # print("Error")
            sys.stderr.write("Error occurred")
            exit(0)   
        time.sleep(1)
        bottomText = browser.find_element_by_id("post_textbox")
        bottomText.send_keys("update status for #51 to implemented")
        bottomText.submit()
        time.sleep(1)
        lastfield=[]
        lastfield = browser.find_elements_by_class_name("post-message__text")
        if "valid" in  (lastfield[len(lastfield)-1].text):
            sys.stderr.write("Not a valid Status")
        else:
            print("Error" )
            exit(0)
chrome_options = Options()
chrome_options.add_argument("--headless")
browser = webdriver.Chrome('/usr/bin/chromedriver',options=chrome_options)
browser.get("http://34.66.158.171:8065/bot/messages/@issuebot")

time.sleep(5)
username = browser.find_element_by_id("loginId")
password = browser.find_element_by_id("loginPassword")
submit   = browser.find_element_by_id("loginButton")
username.send_keys('schippa')
password.send_keys('Issuebot@team11')
submit.submit()


Flow=1
UseCase1(Flow)


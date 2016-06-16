# Alexa Pushbullet SMS Skill
Uses the Pushbullet API to allow SMS sending through the Amazon Alexa Service.


###Usage
  "Alexa, ask pushbullet to send a text to One Two Three Four Five Six Seven Eight Nine Zero saying Meeting at Twelve Thirty."
  
###Support for Contacts
To Add Contacts, use the case statement located in skill.js

`case "john smith":
                    numberSlot = "1234567890"
                    break `

###Requirements
  - Pushbullet API key
  - Pushbullet Device ID
  - Pushbullet User ID
  

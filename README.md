# twilio-call-flooder
flood call

  ```console
  npm install
  node ./tw.js
  ```
  
  ```js 
  {
    accountSid: '', // tiwilio accountSid
    authToken: '', // tiwilio authToken
    toNumber: '', // target number
    listFromNumbers: [], // list of numbers you have on twilio console
    limit: 2, // flood limit (if 0 endless)
    delayDuration: 1000, // delay duration during the call queue
    delayStatuses: {  
        ringing:true,
        queued: true,
        busy: false
    }
  }
  ```

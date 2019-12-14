const {
    accountSid,
    authToken,
    listFromNumbers,
    toNumber,
    limit,
    delayDuration,
    delayStatuses
} = require('./config')

const client = require('twilio')(accountSid, authToken);
const delay = () => new Promise(resolve => setTimeout(resolve, delayDuration))


class flooder {
    async run() {
        let count = 0;
        while (limit ? limit > count : true) {
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
                    console.log(res)

                    //console.log(`calling.. ${r.sid}`)
                }

            } catch (e) {
                console.log(`error: ${e.message}`)
            }
            count++
        }

        console.log('loop ended.. bye.')

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
    async fetch(r) {
        console.log(r)
    }

    async checkState({
        r,
        from
    }) {
        let a = await client.calls.list()
        a = a.filter(call => call.sid == r.sid)[0]
        console.log(`${from} calling.. status: ${a.status}`)

        if (delayStatuses[a.status]) {
            console.log('delaying the next call..')
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
f.run()
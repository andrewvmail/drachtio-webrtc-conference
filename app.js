const Srf = require("drachtio-srf");
const Mrf = require("drachtio-fsmrf");

const srf = new Srf();
srf.connect({ host: "localhost", port: 9022, secret: "cymru" });

srf.on("connect", (err, hostport) => {
  console.log(`successfully connected to drachtio listening on ${hostport}`);
});

const mrf = new Mrf(srf);
// we're connecting to the Freeswitch event socket
mrf.connect(
  { address: "127.0.0.1", port: 8021, secret: "ClueCon" },
  (err, ms) => {
    if (err) {
      return console.log(`error connecting to mediaserver: ${err}`);
    }
    console.log(
      `connected to mediaserver listening on ${JSON.stringify(ms.sip)}`
    );

    srf.invite((req, res) => {
      ms.connectCaller(req, res).then(({ endpoint, dialog }) => {
        console.log("successfully connected call to media server");


        endpoint.api('hupall')
          .then((response) => {
            console.log(`${JSON.stringify(response)}`);
            
            ms.createConference('my_conf', {maxMembers: 50})
              .then((conference) => {
                return endpoint.join(conference)
              })
              .then(() => {
                console.log('endpoint joined to conference')
              });

          });





      });
    });
  }
);

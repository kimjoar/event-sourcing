var redis = require('redis');
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

client.llen('store', function(err, numberOfEvents) {
    console.log('number of events', numberOfEvents);

    client.lrange('store', 0, numberOfEvents, function(err, events) {
        var json = events.map(JSON.parse);

        var planlagte = {};
        var fullførte = {};

        json.forEach(function(event) {
            // console.log(event);
            if (event.event === 'planla-aktivitet') {
                if (fullførte[event.data.id]) {
                    fullførte[event.data.id] = event.data;
                } else {
                    planlagte[event.data.id] = event.data;
                }
            }
            if (event.event === 'fullfør') {
                fullførte[event.data.id] = planlagte[event.data.id];
                delete planlagte[event.data.id]
            }
            if (event.event === 'gi-opp-aktivitet') {
                delete planlagte[event.data.id]
            }
        });

        console.log('planlagte', planlagte);
        console.log('fullførte', fullførte);
    });
});


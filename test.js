var requestManager = require('./requestManager.js');
const client = new requestManager();

client.webRequest({
    type: 'GET',
    host: 'webhook.site',
    path: '/e3c099b4-9339-4ff1-9e47-af32587b7ad4',
    port: 443,
    ssl: true,
    data: {username: 'FHDev'},
    headers: {
        'Cookie': 'test=1'
    },
    queryString: 'userid=123',
    success: function(data, req){
        console.log(data);
        console.log(req.headers);
    },
    error: function(err){
        console.error(err);
    }
});

/*
client.webRequest({
    method: 'GET',
    host: 'localhost',
    path: '/req.php',
    data: {name: 'test'},
    headers: {
        'Cookie': 'test=1'
    },
    success: function(data, req){
        console.log(data);
        console.log(req.headers);

        client.webRequest({
            method: 'GET',
            host: 'localhost',
            path: '/req.php',
            data: {name: 'test'},
            headers: {
                'Cookie': 'test=1'
            },
            success: function(data, req){
                console.log(data);
                console.log(req.headers);
            }
        });

    }
});
*/

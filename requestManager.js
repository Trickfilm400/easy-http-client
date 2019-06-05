//make a new class
class requestManager{

    //define constructor function
    constructor(){

        //import modules
        this.http_module = require('http');
        this.https_module = require('https');
        this.querystring_module = require('querystring');
        this.cookies = {};

    }

    //definde request function
    webRequest(assignment = {}){

        //check if required data exists
        if(assignment.method && assignment.host && typeof assignment.success == "function" && assignment.path){

            //set port if data is not avalible
            if(!assignment.port){
                //check if ssl is activated and set the default port
                if(assignment.ssl){
                    var port = 443;
                }else{
                    var port = 80
                }
            }else{
                //if a custom port is specified, take them
                var port = assignment.port
            }

            //make the data ready
            if(assignment.data){
                //format data into querystring
                var data = this.querystring_module.stringify(assignment.data);
            }else{
                var data = "";
            }

            //check if they want ssl
            if(assignment.ssl){
                //set the http module to ssl
                var http_module = this.https_module;
                var start = 'https://';
            }else{
                //set the default http module
                var http_module = this.http_module;
                var start = 'http://';
            }

            //set options
            if(assignment.method == "POST" || assignment.method == "PUT"){

                //add custom query string to path
                if(assignment.queryString){
                    assignment.path += '?' + assignment.queryString;
                }

                //set options
                var options = {
                    host: assignment.host,
                    port: port,
                    path: assignment.path,
                    method: assignment.method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(data)
                    }
                }

            }else{
                //set url
                var options = start+assignment.host+assignment.path+'?'+data;
                //add custom query string to path
                if(assignment.queryString){
                    options += '&' + assignment.queryString;
                }
            }

            //start the request
            var req = http_module.request(options, (res)=>{

                //check if cookies are set
                if(res.headers['set-cookie']){

                    //get the cookie string
                    var cookies = res.headers['set-cookie'];

                    //create cookie storage array for this host
                    if(!this.cookies[assignment.host]){
                        this.cookies[assignment.host] = [];
                    }
                    this.cookies[assignment.host] = cookies;

                }

                //create variable
                var data = "";

                //handle data event
                res.on('data', (chunk) => {
                    //add data
                    data += chunk;
                });
                //handle end event
                res.on('end', () => {
                    //run success function
                    assignment.success(data, res);
                });

            });

            //handle request error event
            req.on('error', (e) => {
                if(typeof assignment.error == "function"){
                    //call the custom error function
                    assignment.error(e);
                }else{
                    //throw the error if the error function is not set
                    throw e;
                }
            });

            // Write data to request body an end the request
            if(assignment.method == "POST"  || assignment.method == "PUT"){
                req.write(data);
            }

            if(this.cookies[assignment.host]){
                req.setHeader('Cookie',this.cookies[assignment.host]);
            }
            if(assignment.headers){
                var headersArray = Object.entries(assignment.headers).map(([key, value]) => ({key,value}));
                headersArray.forEach(header => {
                    req.setHeader(header.key, header.value);
                });
            }

            req.end();

        }else{
            //throw an error if required fields in request are missing
            throw "Error: Missing required data as object for request"
        }

    }

    getAllCookies(){
        return this.cookies;
    }

    getCookies(host){
        return this.cookies[host];
    }

    deleteAllCookies(){
        delete this.cookies;
        this.cookies = [];
    }

    deleteCookies(host){
        delete this.cookies[host];
    }

}

//export the class as module
module.exports = requestManager;
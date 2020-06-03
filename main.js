/*
This code is under GPL-3.0 License
Author: Feuerhamster
GitHub: https://github.com/Feuerhamster/easy-http-client
*/

//make a new class
class easyHTTPClient{

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

            //set port if port is not set
                                                        //check if ssl is activated and set the default port
                                                                                    //if a custom port is specified, take them
            var port = assignment.port == undefined ? (assignment.ssl ? 443 : 80) : assignment.port;
            
            //make the data ready            //format data into querystring
            var data = assignment.data ? (assignment.json ? JSON.stringify(assignment.data) 
                                          : this.querystring_module.stringify(assignment.data)) : "";
            

            //check if ssl necessary
            var [http_module, start] = assignment.ssl ? [this.https_module, 'https://'] : [this.http_module, 'http://']
           

            //set options
            if(assignment.method == "POST" || assignment.method == "PUT"){

                //add custom query string to path
                if(assignment.queryString){
                    assignment.path += '?' + assignment.queryString;
                }

                var contentType = assignment.json ? "application/json" : "application/x-www-form-urlencoded";
                
                //set options
                var options = {
                    host: assignment.host,
                    port: port,
                    path: assignment.path,
                    method: assignment.method,
                    headers: {
                        'Content-Type': contentType,
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
                if(res.headers['set-cookie'] && !assignment.ignoreCookies){

                    //get the cookie string
                    var cookies = res.headers['set-cookie'];

                    //create cookie storage array for this host
                    if(!this.cookies[assignment.host]){
                        this.cookies[assignment.host] = [];
                    }
                    //save the cookies into the cookie storage
                    this.cookies[assignment.host] = cookies;

                }

                //create variable for the return data of the request
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

            //check if cookies for this host are set
            if(this.cookies[assignment.host]){
                //send the cookies with the request
                req.setHeader('Cookie',this.cookies[assignment.host]);
            }

            //check if custom headers are set
            if(assignment.headers){
                //convert header object to array
                var headersArray = Object.entries(assignment.headers).map(([key, value]) => ({key,value}));
                //add custom headers to the request
                headersArray.forEach(header => {
                    req.setHeader(header.key, header.value);
                });
            }

            // Write data to request body an end the request
            if(assignment.method == "POST"  || assignment.method == "PUT"){
                req.write(data);
            }

            //end request
            req.end();

        }else{
            //throw an error if required fields in request are missing
            throw "Error: Missing required data as object for request"
        }

    }

    getAllCookies(){

        //return an object with all cookies as strings in array and a toObject function
        return {data: this.cookies, toObject: function(){
            
            const hosts = Object.entries(this.data);
            
            var allCookies = {};

            for(const [host, cookies] of hosts){

                var cookieData = [];

                cookies.forEach(cookie => {
                    
                    var el = cookie.split('; ');
                    el = el[0].split('=');

                    var cookieObject = {}
                    cookieObject[el[0]] = el[1];
                    cookieData.push(cookieObject);

                });

                allCookies[host] = cookieData;

            }

            return allCookies;

        }};
    }

    getCookies(host){
        
        //return an object with all cookies for this host as strings in array and a toObject function
        return {data: this.cookies[host], toObject: function(){

            var cookieData = [];

            this.data.forEach(cookie => {
                
                var el = cookie.split('; ');
                el = el[0].split('=');

                var cookieObject = {}
                cookieObject[el[0]] = el[1];
                cookieData.push(cookieObject);

            });

            return cookieData;

        }};
    }

    deleteAllCookies(){
        //delete the object with all cookie data
        delete this.cookies;
        //create a new empty object for new cookies
        this.cookies = {};
    }

    deleteCookies(host){
        //delete all cookies for this host
        delete this.cookies[host];
    }

}

//export the class as module
module.exports = easyHTTPClient;

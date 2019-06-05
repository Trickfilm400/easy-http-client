# easy-http-client
A lightweight and simple node js module for making web requets.

## Features
* Lightweight (0 dependencies)
* Make http requests to any webserver
* Custom request headers
* Supports SSL
* It's so easy to use like jquery's Ajax
* Automated cookie storage (saves cookies from websites temporary and send them on every request to the same host)
* Get and manage cookies

## For what?
* Use REST API's
* Get HTML Content of a website
* Sending data between your NodeJS App and a Webserver

## Installation

### First option
Install it with `npm install easy-http-client`
### Second option
1. Donwload the source code from GitHub
2. Copy the `main.js` file in your project and require it

## How to Use
### Making a simple request

```javascript
var easyHTTPClient = require('easy-http-client');
const client = new easyHTTPClient();

client.webRequest({
    method: 'GET',
    host: 'www.example.com',
    path: '/path/on/website.html',
    data: {'hello': 'world'},
    success: function(data, req){
        console.log(data);
    },
    error: function(err){
        console.error(err);
    }
});

```
### Making an advanced request

```javascript
var easyHTTPClient = require('easy-http-client');
const client = new easyHTTPClient();

client.webRequest({
    method: 'GET',
    host: 'www.example.com',
    port: 80,   //or 443 if you use ssl
    ssl: false, //true if you use ssl
    path: '/path/on/website.html',
    ignoreCookies: false,
    headers: {
        'Cookie': 'test=true',
        'Content-Type': 'application/json'
    },
    data: {'hello': 'world', 'more':'data'},
    queryString: 'some=data',
    success: function(data, req){
        console.log(data);
    },
    error: function(err){
        console.error(err);
    }
});
```
## Documentation

### `webRequest(Object)`
* `Object` **Object** | *required* 
    * `method` **String** | *required* | The HTTP Request Method (`GET`,`POST`,`PUT`,`DELETE`)
    * `host` **String** | *required* | The hostname of the server to which the request should go
    * `port` **Integer** | *optional* | The Port of the webserver of the host
    * `ssl` **Boolean** | *optional* | If you want to use ssl (use http or https)
    * `path` **String** | *required* | The Path in the URL
    * `ignoreCookies` **Boolean** | *optional* | If you want the cookies that come back with the request do not end up in the temporary cookie store

    * `headers` **Object** | *optional* | An Object with custom request headers
        * `Header-Name` **String**
        * `Header-Value` **String**

    * `data` **Object** | *optional* | An Object with the data that will be send on the request
        * `name` **String**
        * `value` **String**

    * `queryString` **String** | *optional* | Add some data to the request's query string

    * `success(data, req)` **Function** | *required* | Callen when the request is finished
        * `data` **String** | The body that returned from the webserver
        * `req` **Object** | The complete request data (with headers and such things)

    * `error(err)` **Function** | *optional* | Callen when something gone wrong

### `getCookies(host)` 
* `host` **String** | *required*
Get the cookies that stored in the cookie storage of a host

#### Retuns:
* **Object**
    * `data` **Array** | An Array with the cookie strings with the cookies from this host
    * `toObject()` **Function** | A function that converts the cookie strings into beautiful javascipt objects

### `deleteCookies(host)`
* `host` **String** | *required*
Delete the cookies that stored in the cookie storage of a host

### `getAllCookies()` 
Get all cookies from all hosts

#### Retuns:
* **Object**
    * `data` **Array** | An Object with all hosts and an array with the cookie strings of the host inside
    * `toObject()` **Function** | A function that converts the cookie strings into beautiful javascipt objects

### `deleteAllCookies()`
Delete all cookies

## Some more examples
### Get the cookies by host
```javascript
var easyHTTPClient = require('easy-http-client');
const client = new easyHTTPClient();
//do your requests

var cookies = client.getCookies('some.host.com').data;
/*
Returns this:
[ 'name1=value1; expires=Wed, 05-Jun-2019 16:35:46 GMT; Max-Age=200',
  'name2=value2; expires=Wed, 05-Jun-2019 16:40:46 GMT; Max-Age=500' ]
*/
```

### Get the cookies by host as object
```javascript
var easyHTTPClient = require('easy-http-client');
const client = new easyHTTPClient();
//do your requests

var cookies = client.getCookies('some.host.com').toObject();
/*
Returns this:
[ { name1: 'value1' }, { name2: 'value2' } ]
*/
```

### Get all cookies as object
```javascript
var easyHTTPClient = require('easy-http-client');
const client = new easyHTTPClient();
//do your requests

var cookies = client.getAllCookies().toObject();
/*
Returns this:
{ hostname: [ { name1: 'value1' }, { name1: 'value1' } ] }
*/
```
var cookieArray = [ 
    'name=value; expires=Wed, 05-Jun-2019 06:43:09 GMT; Max-Age=100',
    'test=test; expires=Wed, 05-Jun-2019 06:43:09 GMT; Max-Age=100' 
];

function extractCookies(array){

    var cookieData = [];

    array.forEach(cookie => {
        
        var elements = cookie.split('; ');
        var thisCookieData = []
        elements.forEach(el =>{
            el = el.split('=');
            thisCookieData.push([el[0],el[1]]);
        });
        cookieData.push(thisCookieData);

    });

    return cookieData;
}

var cookies = extractCookies(cookieArray);
//console.log(cookies[0][0][0]);
var test = {}
test['www.dbna.com'] = "cookie";
console.log(test);
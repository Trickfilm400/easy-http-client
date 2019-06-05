var test = {
    'test1': 'test2',
    'test2': 'test2'
};
var output = Object.entries(test).map(([key, value]) => ({key,value}));
console.log(output);
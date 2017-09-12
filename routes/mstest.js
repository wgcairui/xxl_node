var ms = require('../lib/mssqlContent');

ms.query('select * from cards',function(result){
    console.log(result);
});
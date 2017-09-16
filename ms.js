var sql = require('mssql');
var contstr = require('./passwd/mssql');
sql.connect(contstr).then(function() {
    // Query "mssql://sa:taoyuan@xxl@taoyuangh.ticp.net/healmr"
    
	new sql.Request().query('select * from system_setup').then(function(recordset) {
        console.dir(recordset);
        console.log('end');
	}).catch(function(err) {
        // ... query error checks
        console.log(err);
	});

    // Stored Procedure
	/*
	new sql.Request()
	.input('input_parameter', sql.Int, value)
    .output('output_parameter', sql.VarChar(50))
	.execute('procedure_name').then(function(recordsets) {
		console.dir(recordsets);
	}).catch(function(err) {
		// ... execute error checks
	});
	
	// ES6 Tagged template literals (experimental)
	
	sql.query`select * from mytable where id = ${value}`.then(function(recordset) {
		console.dir(recordset);
	}).catch(function(err) {
		// ... query error checks
	});*/
}).catch(function(err) {
    // ... connect error checks
    console.log('err');
});


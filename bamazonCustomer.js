var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //readProducts() ;
    askQuestion();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products ", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
}


function readProductsById(id) {
    console.log(id);
    console.log("Selecting product...\n");
    connection.query("SELECT * FROM products WHERE ?",

        [{
            item_id: id
        }],



        function(err, res) {
            if (err) throw err;

            if (err === null) {
                console.log("item not in inventory")
            };
            // Log all results of the SELECT statement
            ///console.log(err);

            console.log(res);
            console.log(res[0].product_name);
            connection.end();
        });
}


function askQuestion() {
    inquirer.prompt([{
        type: 'input',
        message: "Select the ID of a Product",
        name: 'userinput'
    }]).then(function(userinput) {

        connection.query("SELECT * FROM products WHERE ?",

            [{
                item_id: userinput.userinput
            }],



            function(err, res) {
                if (err) throw err;

                // console.log(res);

                if (res.length === 0) {
                    console.log("item not in inventory")
                    askQuestion();

                } else {
                    // Log all results of the SELECT statement
                    ///console.log(err);

                    console.log(res);
                    //console.log(res[0].product_name);

                    inquirer.prompt([{
                        type: 'input',
                        message: 'How many would you like?',
                        name: 'quantity'
                    }]).then(function(quantity) {

                        connection.query(`SELECT * FROM products WHERE item_id=${userinput.userinput}`,


                            function(err, res) {
                                if (err) throw err;

                                if (res[0].stock_quantity > quantity.quantity) {
                                    console.log("yes");

                                    connection.query(`UPDATE products SET stock_quantity=stock_quantity-${quantity.quantity} WHERE item_id=${userinput.userinput}`,


                                        function(err, res) {
                                            if (err) throw err;

                                            console.log(res);
                                            connection.end();

                                        });

                                } else {

                                    console.log("Not enough quantity");
                                    askQuestion();
                                }

                            });



                        console.log(userinput.userinput);

                        console.log(quantity.quantity);

                       // connection.end();
                        

                    })
                }




                // }


            });

        console.log('\n');

        // console.log(userinput.userinput);
        //readProductsById(parseInt(userinput.userinput));;








    })
}
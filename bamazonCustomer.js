const mysql = require("mysql");
const inquirer = require("inquirer");
var qString = "CALL usp_getAllBamazonData();";
var tData = require('cli-table');
var msg = "Welcome to Bamazon. Check out these items we have for sale:";
var updatedMsg = "Here's the updated list";
var itemId;
var qty;


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runSql(qString, msg);
});


function runSql(queryString, msg) {
    connection.query(queryString, function (err, res) {
        if (err) throw err;
        print("");
        print(msg);
        var table = new tData({
            head: ['Item Id#', 'Product Name', 'Price'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < res[0].length; i++) {
            table.push(
                [res[0][i].id, res[0][i].name, res[0][i].price]
            );
        }
        print(table.toString());
        promptPurchase();

    });

}


function promptPurchase() {
    //Question 1: ask the user the ID of the product they would like to buy.
    //Question 2: The second message should ask how many units of the product they would like to buy.
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Input the ID of the Product you would like to purchase:",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units of the product would you like to buy?",
        }

    ]).then(function (purchase) {
        itemId = purchase.itemId;
        qty = purchase.quantity;
        print("You selected item ID#: " + itemId);
        print("You selected this amount to purchase: " + qty);
        checkStock(itemId, qty);
    });

}
function checkStock(id, qty) {
    var i = id;
    var q = qty;
    connection.query('CALL usp_checkStock(?);', i, function (err, res) {
        if (err) console.log(err);
        var curStock = res[0][0].stock;
        if (curStock < q) {
            print("Insufficient Quatity in stock.");
            print("Current stock qty: " + curStock);
            print("You requested: " + q);
            print("Please choose less than the current quantity in stock!");
            promptPurchase();
        }
        else {
            connection.query('CALL usp_updateStock(' + i + ',' + q + ');', function (err, res) {
                if (err) console.log("Error updating the database!");
                print("Database updated");
            })
            connection.query('CALL usp_getTotal(' + i + ',' + q + ');', function (err, res) {
                if (err) console.log(err);
                var t = res[0][0].total;
                print("Your purchase total is: " +  t );
            })
                connection.end();

            }

    })
}


function print(string) {
    console.log(string);
}
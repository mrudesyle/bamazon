const mysql = require("mysql");
const inquirer = require("inquirer");
var tData = require('cli-table');
var qString;

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
    menuPrompt();
});


function menuPrompt() {
    print("-------------------------------------");
    print("Bamazon Manager's Console");
    print("-------------------------------------");
    inquirer.prompt([
        {
            type: "list",
            name: "menuOption",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (exec) {
        if (exec.menuOption === "View Products for Sale") {
            qString = "CALL usp_getAllBamazonManagerData();"
            viewProducts(qString, "View Products for Sale:");
        } else if (exec.menuOption === "View Low Inventory") {
            qString = " CALL usp_getLowInventory();"
            viewProducts(qString, "View Products with Low Inventory:");
        } else if (exec.menuOption === "Add to Inventory") {
            addToInventory();
        } else if (exec.menuOption === "Add New Product") {
            addNewProduct();
        } else {
            quit(); print("Quit");
        }
    });
}

function viewProducts(queryString, msg) {
    connection.query(queryString, function (err, res) {
        if (err) throw err;
        print("");
        print(msg);
        var table = new tData({
            head: ['Item Id#', 'Product Name', 'Dept Name', , 'Price', 'Stock'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < res[0].length; i++) {
            table.push(
                [res[0][i].id, res[0][i].name, res[0][i].deptName, res[0][i].price, res[0][i].stock]
            );
        }
        print(table.toString());
        menuPrompt();
    });
}

function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Input the ID of the Product you would like to add stock to:",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add:",
        },
    ]).then(function (addInv) {
        var i = addInv.itemId;
        var q = addInv.quantity;
        connection.query('CALL usp_addToStock(' + i + ',' + q + ');', function (err, res) {
            if (err) console.log("Error updating the database!");
            print("Database updated");
        })
        menuPrompt();
    });

}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "prodName",
            message: "Enter Product Name: ",
        },
        {
            type: "list",
            name: "dept",
            message: "Select the Department the item belongs to:",
            choices: ["Clothing", "Electronics", "HomeGoods"]
        },
        {
            type: "input",
            name: "price",
            message: "Enter Item Price: ",
        },
        {
            type: "input",
            name: "stock",
            message: "Enter Stock Quantity: ",
        },
    ]).then(function (addItem) {
        var pn = addItem.prodName;
        var d = addItem.dept;
        var p = addItem.price;
        var s = addItem.stock;
        
        connection.query('CALL usp_insertInventory("' + pn + '","' + d + '",' + p + ',' + s + ');', function (err, res) {
            if (err) console.log(err, + "Error updating the database!");
            print("Database updated");          
        })
        menuPrompt();
    });

}


function quit() {
    connection.end();
}

function print(string) {
    console.log(string);
}
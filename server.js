const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const dbConnection = require("./dbConnection.js");
const bodyParser = require("body-parser");
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()); 
app.use(cors(corsOptions))

const url = "https://www.companydetails.in"

dbConnection.con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const clientsData = [];

function crawl(){
    axios.get(url+"/latest-registered-company-mca")
    .then((response) => {
        const $ = cheerio.load(response.data);
        $(".row.g-3.banklisting a").each((i,el) => {
            crawlClient($(el).attr("href"))
        })
    }).catch((e)=>{
        console.log(e )
    })
}

function crawlClient(clientName){
    const clientUrl = url+clientName;
    axios.get(clientUrl).then((response) => {
        const $ = cheerio.load(response.data);
        let client = [] ;
        let CIN = $($(".mb-0.pt-1.text-left")[4]).text().trim();
        let PIN = $($(".mb-0.pt-1.text-left")[14]).text().trim();
        
        client.push($($(".mb-0.pt-1.text-left")[0]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[2]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[4]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[6]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[7]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[8]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[13]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[14]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[15]).text().trim());
        client.push($($(".mb-0.pt-1.text-left")[17]).text().trim());
        if(CIN.length === 21 && PIN.length === 6){
            clientsData.push(client)
            var insertQuery = "INSERT INTO clientDetails(name, status,  cin, category, subcategory, class,state, pin, country, email) values (?,?,?,?,?,?,?,?,?,?)"
            dbConnection.con.query(insertQuery,client, function (err, result) {
                if (err) throw err;
                console.log("Result: " + JSON.stringify(result));
            });
            
        }else{
            console.log(client["PIN"]+" Inavlid CIN/PIN length")
        } 
    })
}

app.get("/clients/", (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const email = req.query.email;
    const cin = req.query.cin;
    let getClientsQuery = "select * from clientDetails"
    if(id !== undefined){
        getClientsQuery += " where id = "+ parseInt(id)
    }
    else if(name !== undefined){
        getClientsQuery += " where name = '"+ name +"'"
    }else if(email !== undefined){
        getClientsQuery += " where email = '"+ email +"'"
    }else if(cin !== undefined){
        getClientsQuery += " where cin = '"+ cin +"'"
    }
    dbConnection.con.query(getClientsQuery, function (err, result) {
    if (err) {
        res.status(400).json({'error':'Error in fetching client details', "message": String(err)});
        res.end();
    };
    res.json(result)
    });
})

app.get("/clients/:id", (req, res) => {
    const id = req.params.id;
    let getClientByIdQuery = "select * from clientDetails where id = ?" ;
    dbConnection.con.query(getClientByIdQuery,[parseInt(id)] ,function (err, result) {
    if (err) {
        res.status(100).json({'error':'Error in fetching client details', "message": String(err)});
    };
    if(result.length === 0){
        res.status(404).json({'error':"No Client ID found"});
    }else{
        res.json(result);
    }
    res.end();
    });
})

app.delete("/clients/:id", (req, res) => {
    const id = req.params.id;
    let deleteClientByIdQuery = "delete from clientDetails where id = ?";
    dbConnection.con.query(deleteClientByIdQuery,[id],function (err, result) {
    if (err) {
        res.status(100).json({'error':'Error in fetching client details', "message": String(err)});
    };
    if(result.affectedRows === 0){
        res.status(404).json({'error':"No client ID found"});
    }else{
        res.json(result);
    }
    res.end();
    });
})

app.post("/clients", (req, res) => {
    const name = req.body.name;
    const status = req.body.status;
    const cin = req.body.cin;
    const category = req.body.category;
    const subCategory = req.body.subcategory;
    const className = req.body.class;
    const state = req.body.state;
    const pin = req.body.pin;
    const country = req.body.country;
    const email = req.body.email;
    let insertClientQuery = 'INSERT INTO clientDetails(name, status,cin,state, pin, country,email,category,subcategory,class) values (?,?,?,?,?,?,?,?,?,?)' ;
    dbConnection.con.query(insertClientQuery,[name, status, cin,state, pin, country, email,category,subCategory,className] ,function (err, result) {
        if (err) {
            res.status(100).json({'error':'Error in fetching client details', "message": String(err)});
        };
        res.json(result);
        res.end();
    });
})

app.post("/clients/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const status = req.body.status;
    const cin = req.body.cin;
    const category = req.body.category;
    const subCategory = req.body.subcategory;
    const className = req.body.class;
    const state = req.body.state;
    const pin = req.body.pin;
    const country = req.body.country;
    const email = req.body.email;

    if(cin !== undefined && cin.length !== 21){
        res.status(422).json({'error':'Invalid CIN length'});
        res.end();
    }
    else if(pin !== undefined && pin.length !== 6){
        res.status(422).json({'error':'Invalid PIN length'});
        res.end();
    }else{
        let insertClientQuery = 'update clientDetails set name=?, status=?, cin=?,state=?, pin=?, country=?, email=?, category=?, subcategory=?, class=? where id = ? ' ;
        dbConnection.con.query(insertClientQuery,[name, status, cin, state, pin, country, email,category, subCategory, className, id] ,function (err, result) {
            if (err) {
                res.status(100).json({'error':'Error in updating client details', "message": String(err)});
                res.end();
            };
            if(result.affectedRows === 0){
                res.status(404).json({'error':"Client ID doesn't exists"});
                res.end();
            }else{
                res.json(result);
                res.end();
            }
        });
    }
})
process.on("uncaughtException", (err)=>{
    console.log("Exception: "+String(err));
})

app.listen(3000, ()=>{
    console.log("Node Server Running on PORT 3000");
})

// crawl()
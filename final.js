process.stdin.setEncoding("utf8");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

/* Our database and collection */
const databaseAndCollection = {db: db, collection: collection};

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://andrewyi117:${password}@cluster0.zwsujtr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const http = require("http");
const express = require("express"); /* Accessing express module */
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express(); /* app is a request handler function */

const statusCode = 200;
const portNumber = 4000;

app.use(bodyParser.urlencoded({extended:false}));

/* directory where templates will reside */
app.set("views", path.resolve(__dirname, "templates"));
//app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(__dirname));

/* view/templating engine */
app.set("view engine", "ejs");

console.log(`Web server started and running at http://localhost:${portNumber}`)

app.get("/", (request, response) => { 
  response.render("home") 
});

app.get("/after_debut", (request, response) => { 
  response.render("after") 
});

app.get("/choose_member", async (request, response) => { 
  try {
    await client.connect();
    const result = await client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .deleteMany({});
    num = result.deletedCount
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  response.render("members") 
});

app.post("/chosen_member", async (request, response) => { 
  let n =  request.body.name;

  let filter = {name: n.toLowerCase()}
  let member_found = ""
  
  try {
    await client.connect();
  
    await insertMember(client, databaseAndCollection, filter);
    const result = await client.db(databaseAndCollection.db)
                      .collection(databaseAndCollection.collection)
                      .findOne(filter);
    if(result){
      member_found = result.name
    }

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  } 
            
  response.render(member_found)
});

async function insertMember(client, databaseAndCollection, member) {
  const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(member);
}

const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
  let dataInput = process.stdin.read();
  if (dataInput !== null) {
    let command = dataInput.trim();
    if (command === "stop") {
        process.stdout.write("Shutting down the server\n");
        process.stdout.write(__dirname);
        process.exit(0);
    } else {
        process.stdout.write(`Invalid command: ${command}\n`);
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});

app.listen(portNumber);
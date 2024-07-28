import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client ({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {

try {
  let item_list = await db.query("SELECT * FROM items ORDER BY id ASC ");
  let items = item_list.rows;
  // console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
} catch (err) {
  console.log(err);
}
});

app.post("/add", async (req, res) => {
try {
    const item = req.body.newItem;
    // console.log(item);
    // items.push({ title: item });
    await db.query("INSERT INTO items (title) VALUES ($1);", [item]);
    // console.log(items);
    res.redirect("/");
} catch (err) {
  console.log(err);  
}
});

app.post("/edit", async (req, res) => {
try {
    const item = req.body.updatedItemTitle;
    const itemId = req.body.updatedItemId;
    // console.log(itemId);
    // console.log(item);
    await db.query("UPDATE items SET title=$1 WHERE id=$2;", [item, itemId]);
    // console.log(items);
    res.redirect("/");
} catch (err) {
  console.log(err); 
}
});

app.post("/delete", async (req, res) => {
try {
    const itemId = req.body.deleteItemId;
    // const itemId = req.body.updatedItemId;
    await db.query("DELETE FROM items WHERE id=$1;", [itemId]);  
    res.redirect("/");
} catch (err) {
  console.log(err);  
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

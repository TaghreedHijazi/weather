import express from "express";
import hbs from "hbs";
import path from "path";
import axios from "axios";
import weatherData from "../utils/weatherData.js";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.render("index",{title: "Weather App"});
});

app.get("/weather", (req, res) =>{
    if (!req.query.address){
        return res.send("Addess is required!")
    }
    weatherData(req.query.address, (error, result) =>{
        if(error){
            return res.send(error);
        }
        res.send(result);
    });
});


app.get("*", (req, res) => {
    res.render("404",{title: "404 - Page not found"});
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
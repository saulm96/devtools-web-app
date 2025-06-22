import express, {Express} from "express";
import {sequelize} from "./config/database";
import mainRouter from "./routes/router";

const app: Express = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(mainRouter);

const start = async(): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Conection to database has been successfully established");

        await sequelize.sync({force: false})
        console.log("All models were synchronized successfully");

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);        
    }
};

void start();
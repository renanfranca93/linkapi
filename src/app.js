import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';



class App {
    constructor(){
        this.server = express();
        this.middlewares();
        this.routes();
        this.mongo();
    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/deals',
            {useNewUrlParser:true, userFindAndModify:true}
        )
    }

    middlewares(){
        this.server.use(express.json());
    }
    routes(){
        this.server.use(routes); 

    }

}

export default new App().server;
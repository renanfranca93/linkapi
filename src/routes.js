import { Router } from 'express';
import request from 'request';
import mongoose from 'mongoose';
import findwon from './controllers/apiController'
import infoController from './controllers/infoController'

const routes = new Router();


//rota que exibe as instruções
routes.get('/', infoController);

//rota que executa a migração das informações (pipedrive->bd->bling)
routes.get('/migrate', findwon);


export default routes;
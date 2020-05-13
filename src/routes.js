import { Router } from 'express';
import request from 'request';
import mongoose from 'mongoose';
import {migrate, list} from './controllers/apiController'
import infoController from './controllers/infoController'

const routes = new Router();


//rota que exibe as instruções
routes.get('/', infoController);

//rota que executa a migração das informações (pipedrive->bd->bling)
routes.get('/migrate', migrate);

//rota que executa a listagem dos dados do bd
routes.get('/list', list);


export default routes;
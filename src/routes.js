import { Router } from 'express';
import request from 'request';
import mongoose from 'mongoose';
import findwon from './apiController'
import info from './infoController'

const routes = new Router();


//rota que exibe as instruções
routes.get('/', info);

//rota que executa a migração das informações (pipedrive->bd->bling)
routes.get('/findwon', findwon);


export default routes;
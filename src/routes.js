import { Router } from 'express';
import request from 'request';

const routes = new Router();

routes.get('/', (req, res)=>{
    return res.json({message:'Hello world!'});
})


//rota para buscar registros de negócios "ganho" no pipedrive

routes.get('/findwon', async function(req, res){

    const dealsdata = [];

      await request("https://api.pipedrive.com/v1/deals/?api_token=5cbf5a48c36e90798eb8685cf79e61efa873f096", function(error, response, body) {
     
      //converter string data em json para manipular as informações
      var deals = JSON.parse(body).data;
        
      //percorrer os registros buscando apenas os negócios "ganho" (status 
        //igual a 'won')
      for(let i = 0; i < deals.length; i++){ 
         if (deals[i].status == 'won') {

            
            //incluindo em um array temporário os dados que quero salvar no 
            //banco de dados
            const localdata = [];

            localdata.deal_id = deals[i].id;
            localdata.user_id = deals[i].user_id['id'];
            localdata.user_name = deals[i].user_id['name'];
            localdata.name = deals[i].org_name;
            localdata.value = deals[i].value;
            localdata.date = deals[i].won_time;
    
            
            //transformando o array temporário em um objeto
            const obj = {...localdata};
            
            //incluindo o objeto no array principal que será a collection a ser
            //salva no banco de dados
            dealsdata.push(obj);

            console.log(dealsdata);
         }
        
        }   
    

      return res.json(dealsdata);
      });

})



export default routes;
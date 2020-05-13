import { Router } from 'express';
import request from 'request';
import mongoose from 'mongoose';

const routes = new Router();

 //criando schema do mongo
 var dealSchema = new mongoose.Schema({
  deal_id: Number,
  user_id: Number,
  user_name: String,
  name: String,
  value: Number,
  date: Date,

});

//criando model 
var Deal = mongoose.model("Deal", dealSchema);

routes.get('/', (req, res)=>{
    return res.json({message:'Hello world!'});
})



//funcao que consome a API do Bling
//url de adicionar pedido abaixo
//https://bling.com.br/Api/v2/pedido/json/&apikey=81bce59a517342a85a4d7f8246911bf3d0caf355d5c87b9abf7a58761a4807a73f8fe826

async function bling (req, res){ 

  await request("https://bling.com.br/Api/v2/produtos/json/&apikey=81bce59a517342a85a4d7f8246911bf3d0caf355d5c87b9abf7a58761a4807a73f8fe826", function(error, response, body) {
         
     
            //converter string data em json para manipular as informações
            var response = JSON.parse(body).retorno.produtos;
            const teste = response[0].produto.descricao;
            console.log(`Retorno exemplo da API Bling: ${teste}`);

          });
}



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

            //criar o xml para ser enviado
            const xml = `
            
            <?xml version="1.0" encoding="UTF-8"?>
            <pedido>
            <cliente>
            <nome>Organisys Software</nome>
            <tipoPessoa>J</tipoPessoa>
            <endereco>Rua Visconde de São Gabriel</endereco>
            <cpf_cnpj>00000000000000</cpf_cnpj>
            <ie_rg>3067663000</ie_rg>
            <numero>392</numero>
            <complemento>Sala 54</complemento>
            <bairro>Cidade Alta</bairro>
            <cep>95.700-000</cep>
            <cidade>Bento Gonçalves</cidade>
            <uf>RS</uf>
            <fone>5481153376</fone>
            <email>teste@teste.com.br</email>
            </cliente>
            <transporte>
            <transportadora>Transportadora XYZ</transportadora>
            <tipo_frete>R</tipo_frete>
            <servico_correios>SEDEX - CONTRATO</servico_correios>
            <dados_etiqueta>
            <nome>Endereço de entrega</nome>
            <endereco>Rua Visconde de São Gabriel</endereco>
            <numero>392</numero>
            <complemento>Sala 59</complemento>
            <municipio>Bento Gonçalves</municipio>
            <uf>RS</uf>
            <cep>95.700-000</cep>
            <bairro>Cidade Alta</bairro>
            </dados_etiqueta>
            <volumes>
            <volume>
            <servico>SEDEX - CONTRATO</servico>
            <codigoRastreamento></codigoRastreamento>
            </volume>
            <volume>
            <servico>PAC - CONTRATO</servico>
            <codigoRastreamento></codigoRastreamento>
            </volume>
            </volumes>
            </transporte>
            <itens>
            <item>
            <codigo>001</codigo>
            <descricao>Caneta 001</descricao>
            <un>Pç</un>
            <qtde>10</qtde>
            <vlr_unit>1.68</vlr_unit>
            </item>
            <item>
            <codigo>002</codigo>
            <descricao>Caderno 002</descricao>
            <un>Un</un>
            <qtde>3</qtde>
            <vlr_unit>3.75</vlr_unit>
            </item>
            <item>
            <codigo>003</codigo>
            <descricao>Teclado 003</descricao>
            <un>Cx</un>
            <qtde>7</qtde>
            <vlr_unit>18.65</vlr_unit>
            </item>
            </itens>
            <parcelas>
            <parcela>
            <data>01/09/2009</data>
            <vlr>100</vlr>
            <obs>Teste obs 1</obs>
            </parcela>
            <parcela>
            <data>06/09/2009</data>
            <vlr>50</vlr>
            <obs></obs>
            </parcela>
            <parcela>
            <data>11/09/2009</data>
            <vlr>50</vlr>
            <obs>Teste obs 3</obs>
            </parcela>
            </parcelas>
            <vlr_frete>15</vlr_frete>
            <vlr_desconto>10</vlr_desconto>
            <obs>Testando o campo observações do pedido</obs>
            <obs_internas>Testando o campo observações internas do pedido</obs_internas>
            </pedido>
          
            `

            bling();
            
            //incluindo o objeto no array principal 
            //dealsdata.push(obj);
            

            var myData = new Deal(obj);
            myData.save()
            .then(item => {
              res.send("Collection saved!");
            })
            .catch(err => {
              res.status(400).send("Unable to save to database");
            });

            console.log(dealsdata);
         }
        
        }   

        
    

      //return res.json(dealsdata);
      });

})



export default routes;
import request from 'request';
import mongoose from 'mongoose';
import {dealSchema, Deal} from '../models/Deal';


//funcao que busca os dados na api da pipedrive
async function migrate (req, res){

  await request('https://api.pipedrive.com/v1/deals/?api_token=5cbf5a48c36e90'+
  '798eb8685cf79e61efa873f096', function(error, response, body) {

  var deals = JSON.parse(body).data;

  for(let i = 0; i < deals.length; i++){ 
    if (deals[i].status == 'won') {
      
      const localData = [];

      localData.dealId = deals[i].id;
      localData.userId = deals[i].user_id['id'];
      localData.userName = deals[i].user_id['name'];
      localData.orgName = deals[i].org_name;
      localData.value = deals[i].value;
      localData.date = deals[i].won_time;

      //chamando a funcção que envia o pedido para o Bling
      bling(localData);

      const obj = {...localData};
      //chamando a função que salva no bd
      savemongo(obj);
                  

    }
    
    }   
  });

}

//funcao que salva no banco de dados
function savemongo(obj){
  let data = obj;

  var myData = new Deal(obj);
  myData.save()
    .then(item => {
      console.log("Collection saved!");
  })
    .catch(err => {
      console.log("Unable to save to database");
  });

}



//funcao que consome a API do Bling adicionando pedido na plataforma
async function bling (req, res){ 

const cliente = req.orgName;
const valor = req.value;
const data = req.date;

var request = require("request");

var options = {
    method: 'POST',
    url: 'https://bling.com.br/Api/v2/pedido/json/%26apikey=81bce59a517342a'+
    '85a4d7f8246911bf3d0caf355d5c87b9abf7a58761a4807a73f8fe826',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: {
      xml: `<?xml version="1.0" encoding="UTF-8"?>\n<pedido>\n<cliente>\n
      <nome>${cliente}</nome>\n<tipoPessoa>J</tipoPessoa>\n<endereco>Rua 
      Visconde de São Gabriel</endereco>\n<cpf_cnpj>00000000000000</cpf_cnpj>\n
      <ie_rg>3067663000</ie_rg>\n<numero>392</numero>\n<complemento>Sala 54
      </complemento>\n<bairro>Cidade Alta</bairro>\n<cep>95.700-000</cep>\n
      <cidade>Bento Gonçalves</cidade>\n<uf>RS</uf>\n<fone>5481153376</fone>\n
      <email>teste@teste.com.br</email>\n</cliente>\n<transporte>\n
      <transportadora>Transportadora XYZ</transportadora>\n<tipo_frete>R</tipo_frete>\n
      <servico_correios>SEDEX - CONTRATO</servico_correios>\n<dados_etiqueta>\n
      <nome>Endereço de entrega</nome>\n<endereco>Rua Visconde de São Gabriel</endereco>\n
      <numero>392</numero>\n<complemento>Sala 59</complemento>\n<municipio>
      Bento Gonçalves</municipio>\n<uf>RS</uf>\n<cep>95.700-000</cep>\n
      <bairro>Cidade Alta</bairro>\n</dados_etiqueta>\n<volumes>\n<volume>\n
      <servico>SEDEX - CONTRATO</servico>\n<codigoRastreamento></codigoRastreamento>\n
      </volume>\n<volume>\n<servico>PAC - CONTRATO</servico>\n<codigoRastreamento>
      </codigoRastreamento>\n</volume>\n</volumes>\n</transporte>\n<itens>\n
      <item>\n<codigo>001</codigo>\n<descricao>Caneta 001</descricao>\n
      <un>Pç</un>\n<qtde>10</qtde>\n<vlr_unit>1.68</vlr_unit>\n</item>\n
      <item>\n<codigo>002</codigo>\n<descricao>Caderno 002</descricao>\n
      <un>Un</un>\n<qtde>3</qtde>\n<vlr_unit>3.75</vlr_unit>\n</item>\n
      <item>\n<codigo>003</codigo>\n<descricao>Teclado 003</descricao>\n
      <un>Cx</un>\n<qtde>7</qtde>\n<vlr_unit>18.65</vlr_unit>\n</item>\n
      </itens>\n<parcelas>\n<parcela>\n<data>01/09/2009</data>\n<vlr>100</vlr>\n
      <obs>Teste obs 1</obs>\n</parcela>\n<parcela>\n<data>06/09/2009</data>\n<vlr>50</vlr>\n
      <obs></obs>\n</parcela>\n<parcela>\n<data>${data}</data>\n<vlr>${valor}</vlr>\n
      <obs>Teste obs 3</obs>\n</parcela>\n</parcelas>\n<vlr_frete>15</vlr_frete>\n
      <vlr_desconto>10</vlr_desconto>\n<obs>Testando o campo observações do pedido</obs>\n
      <obs_internas>Testando o campo observações internas do pedido</obs_internas>\n
      </pedido>`
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

});
  
}

function list(){


  Deal.find({}).then((deal) => {
    console.log(deal);
    }).catch((erro) => {
    console.log('Nenhum registro encontrado');
   })

}

export {migrate, list};
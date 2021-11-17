const pacsConfig = require('./conf/private');
const dicomencode = require('./conf/encode');
const fetch = require('node-fetch');
const modo = process.argv[2];
const path = process.argv[3]; 


async function login(host,url,rmethod,header,param) {
        const { URLSearchParams } = require('url');
        const params = new URLSearchParams(param);       
        const res = await fetch(host + url , {
            method: rmethod,
            headers: header,
            body: params
        });
        const data = await res.json();
        return data;
    };

async function mppsstarted(host,url,rmethod,rheader){
    const res = await fetch(host + url, {
        method: rmethod,
        headers: rheader
    });
};
async function stowrs(host,url,rmethod,rheader,rbody){
    const res = await fetch(host + url, {
        method: rmethod,
        headers: rheader,
        body: rbody
    }).then((res)=>res.json()).catch(error => {
        //console.error('esto fallo man\n\n'+error)
        salida= JSON.stringify(error)
        const fs = require('fs');
            fs.writeFile('error.json',salida, (err) => { 
        // In case of a error throw err. 
            if (err) throw err; 
            })
    })//.then(res=>console.log(res));
};
const delay = ms => new Promise(res => setTimeout(res, ms));
async function main(){
    if ((modo===undefined)||(path===undefined)){
        console.log('Especificar modo y path de salida')
    }
    else{
         
        const token = await login(pacsConfig.auth.host,pacsConfig.auth.url,'POST',
                {
                'Accept': 'application/json'
                },
                {
                    grant_type: pacsConfig.auth.grant_type,
                    client_id: pacsConfig.auth.clientId,
                    client_secret: pacsConfig.auth.clientSecret 
                }).then (token=>token.access_token)
                .catch(error => {
                    console.error('esto fallo man\n\n'+error)
                    salida= JSON.stringify('error')
                    const fs = require('fs');
                        fs.writeFile(path+'salida.json',salida, (err) => { 
                    // In case of a error throw err. 
                        if (err) throw err; 
                        })
                });;
        switch (modo) {
            case 'mwl':
              //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
              {
                const fecha = process.argv[4]; 
                
                if (fecha===undefined){console.log('Error')}
                    else{                    
                        param={limit: 21,
                            offset: 0,
                            'ScheduledProcedureStepSequence.ScheduledProcedureStepStartDate' : fecha
                            };
                        const { URLSearchParams } = require('url');
                        const params = new URLSearchParams(param);
                        const res= await fetch(pacsConfig.pacs.host + pacsConfig.pacs.urlmwl+'?'+ params.toString(), 
                                        {method: 'GET',
                                        headers: {'accept': "application/json",
                                                'authorization': `Bearer ${token}`,
                                                'content-type': "application/dicom+json"},
                                         });
                        if (res.status==204) {salida=''}
                         else {const data = await res.json();
                            salida= JSON.stringify(data)}
                        const fs = require('fs');
                        fs.writeFile(path+'salida.json',salida, (err) => { 
                    // In case of a error throw err. 
                        if (err) throw err; 
                        })
                    }   
                break;}
            case 'patient': //return birthdate of a patient by id
                const id = process.argv[4];
                //const path = process.argv[4];  

                if (id===undefined){console.log('Error')}
                    else{
                        const res= await fetch(pacsConfig.pacs.host + pacsConfig.pacs.urlpat+'?PatientID='+ id, 
                                        {method: 'GET',
                                        headers: {'accept': "application/json",
                                                'authorization': `Bearer ${token}`,
                                                'content-type': "application/dicom+json"},
                                         });
                        if (res.status==204) {salida=''}
                        else {const data = await res.json();
                             salida= JSON.stringify(data[0]['00100030'].Value[0])}
                        const fs = require('fs');
                                        // Write data in 'salida.json' .
                        fs.writeFile(path+'paciente.json',salida, (err) => { 
                                    // In case of a error throw err. 
                                        if (err) throw err; 
                                        })
                    }
            case 'sps':
              //arrancar procedimiento SPS 
                {
                const spsfile = process.argv[4];  
                if (spsfile===undefined) {console.log('Error')}
                else {
                    const fs = require('fs');
                    let rawdata = fs.readFileSync(spsfile);
                    let sps = JSON.parse(rawdata);
                    sps=sps[0]
                    console.log(sps["400100"].Value[0]["400009"].Value[0] )
                    const url2=pacsConfig.pacs.urlmwl+`/${sps["0020000D"].Value[0]}/${sps['400100'].Value[0]["400009"].Value[0]}/status/STARTED/`;
                    const list= await mppsstarted(pacsConfig.pacs.host,url2,'POST',
                        {
                            'accept': "application/json",
                            'authorization': `Bearer ${token}`,
                            'content-type': "application/dicom+json"
                        });
                }
                
                break;}
            case 'stow': {
                const spsfile = process.argv[4];  
                let imgnum = process.argv[5];  
                if (spsfile===undefined) {console.log('Error')}
                else {
                    const fs = require('fs');//lee la metadata del item de la worklist
                    let rawdata = fs.readFileSync(spsfile);
                    let sps = JSON.parse(rawdata);
                    let i=1;
                    imgnum= parseInt(imgnum);
                    const metadata= [];
                    sps=sps[0]                
                    process.argv.slice(6).forEach(filename=> {//recorre cada uno de los archivos de entrada, ie cada imagen a dicomizar
                        metadapart= dicomencode.dicomencode(sps,imgnum,filename);//codifica el obj json+dicom para esa imagen
                        i++;
                        imgnum++;
                        metadata.push(metadapart);//adjunta al arreglo 
                    });
                    console.log(metadata[0])  
                    if (i>1){//aca arma el boundary en un buffer
                        var bodyBuffer = Buffer.from("\r\n--myboundary\r\nContent-Type: application/dicom+json\r\n\r\n"+JSON.stringify(metadata)+"\r\n");
                        for (let j = 1; j < i; j++) {
                            mimefile= Buffer.from(`\r\n--myboundary\r\nContent-Type: image/jpeg\r\nContent-Location: ${process.argv[5+j]}\r\n\r\n`);
                            stream = fs.readFileSync(process.argv[5+j]);
                            console.log(process.argv[5+j])
                            bodyBuffer=Buffer.concat([bodyBuffer,mimefile,stream]);
                            console.log(bodyBuffer)
                        };
                        bodyBuffer = Buffer.concat([bodyBuffer,Buffer.from('\r\n--myboundary--')]);
                        const stow= stowrs(pacsConfig.pacs.host,pacsConfig.pacs.urlstow,'POST',
                            {
                                "accept": "application/dicom+json",
                                'authorization': `Bearer ${token}`,
                                'content-type': "multipart/related;type=\"application/dicom+json\";boundary=myboundary"
                            },bodyBuffer);
                    }}
                await delay(1000);
                console.log("Waited 1s");
                break;
            }                  
            default:
              {console.log('error');
              break;}
          }
        }
    }
main()



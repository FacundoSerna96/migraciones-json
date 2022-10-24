const dataJSON = require('./0.json');

const { writeFile } = require('fs');

const AWS = require('aws-sdk');

//conecto a AWS
var s3 = new AWS.S3({ 
    accessKeyId:"AKIAVMY5WGXJPSO767OH", 
    secretAccessKey: "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", 
    region: "us-east-1" 
});


const obtenerArchivos = async (key) => {
    return new Promise((resolve, reject) => {
       
        //parametros basicos
        var params = {
            Bucket: "dms-prod-acss3stack-1xjtqgk-acscontentstorebucket-y8ecpu3y2xb1",
            Key: key //archivo a descargar
        };

        //obtengo objeto
        s3.getObject(params, (err, data) => {


            if (err) {
                console.log( params.Key);
                reject("error con key: ", params.Key)
            }
            else{

                //obtengo el nombre del archivo 
                //sacandole las barras con el split
                //y sacando el ultimo elemento con pop()
                let name = params.Key.split("/").pop();

                //genero el archivo y lo guarda en la carpeta "archivos"
                writeFile(`./archivos/${name}`, data.Body, (err) => {
                    if(err){
                        console.log(err);
                    } else{
                        console.log('Data ok!');
                    }
                });

                resolve('Descarga completada')
            }
            
        })
    })
}


//recorro el json
dataJSON.forEach((data,index) =>{

    //corta el string para que quede armada la key
    let key = data.contentUrls["cm:content"].substring(7);
    obtenerArchivos(key).catch(err => {
        console.log(err);
    })

})


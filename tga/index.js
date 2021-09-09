const tga2png = require('tga2png');
const pngToJpeg = require('png-to-jpeg');
//const folder = 'C:/Users/tecnica/Documents/src/endo/tga';
const fs = require('fs')
const folder = process.argv[2];

var pngFiles=[]

const ps = fs.readdirSync(folder).map(file => {
    nom=file.split('.')
    //console.log()
    if (nom[1]=='tga')
        {
            pngFile=nom[0];
            pngFiles.push(pngFile);
            return tga2png(folder+'\\'+file,folder+'\\'+pngFile+'.png').then(buf=> {
            //console.log('the png buffer is', buf);
                }, err => {
                    console.log('error', err);
                });
    }
});

Promise.all(ps).then(()=>{
    pngFiles.forEach(item => {
        buffer=fs.readFileSync(folder+'\\'+item+'.png');
        pngToJpeg({quality: 90})(buffer).then(output => fs.writeFileSync(folder+'\\'+item+'.jpeg', output))
        });
    })



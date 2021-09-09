//adapt this enconding if necessary
const moment =require('moment');
module.exports = {
  dicomencode (sps,imgnum,filename){
    const json = {
        '00080005': {
            vr: 'CS',
            Value: [
                'ISO_IR 192'
            ]
        },
        '00080012': {
            vr: 'DA',
            Value: [
                moment().format('YYYYMMDD')
            ]
        },
        '00080013': {
            vr: 'TM',
            Value: [
                moment().format('HHMM')
            ]
        },
        '00080016': {
            vr: 'UI',
            Value: [
                '1.2.840.10008.5.1.4.1.1.77.1.1'
            ]
        },
        '00080018': {
            vr: 'UI',
            Value: [
                `${sps['0020000D'].Value[0]}.${imgnum}`
            ]
        },
        '00080020': {
            vr: 'DA',
            Value: [
                moment().format('YYYYMMDD')
            ]
        },
        '00080030': {
            vr: 'TM',
            Value: [
                moment().format('HHMM')
            ],
        },
        '00080050': {
            vr: 'SH',
            Value: [
                sps['00080050'].Value[0]
            ],
        },
        '00080060': {
            vr: 'CS',
            Value: [
                'ES'
            ]
        },
        '00080064': {
            vr: 'CS',
            Value: [
                'DV'
            ]
        },
        '00080090': {
            vr: 'PN',
            Value: [
                sps['00400100'].Value[0]['00400006'].Value[0].Alphabetic
            ]
        },
        '0008103E': {
            vr: 'LO',
            Value: [
                'Video Endoscopia Digitalizada'
            ]
        },
        '00100010': {
            vr: 'PN',
            Value: [
                sps['00100010'].Value[0].Alphabetic
            ]
        },
        '00100020': {
            vr: 'LO',
            Value: [
                sps['00100020'].Value[0]
            ]
        },
        '0020000D': {
            vr: 'UI',
            Value: [
                sps['0020000D'].Value[0]
            ]
        },
        '0020000E': {
            vr: 'UI',
            Value: [
                `${sps['0020000D'].Value[0]}.1`
            ]
        },
        '00200010': {
            vr: 'SH'
        },
        '00200011': {
            vr: 'IS',
            Value: [
                1
            ]
        },
        '00200013': {
            vr: 'IS',
            Value: [
                imgnum
            ]
        },
        '00280301': {
            vr: 'CS',
            Value: [
                'YES'
            ]
        },
        '7FE00010': { 
            vr: "OB",
            BulkDataURI: filename 
        }
    };
    return json;
}
}
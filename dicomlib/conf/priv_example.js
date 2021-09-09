//rename this file as private.js
const pacsConfig={
    auth:{
        host:'keycloak server https address',
        url:'/auth/realms/dcm4che/protocol/openid-connect/token',//example
        grant_type: 'client_credentials',
        clientId:'andes',//client id
        clientSecret:'xxxx'//your token
        },
    pacs:{
        host: 'pacs https address', 
        urlmwl: '/dcm4chee-arc/aets/PACSHPN/rs/mwlitems', //rs api endpoints
        urlstow:'/dcm4chee-arc/aets/PACSHPN/rs/studies',
        urlpat: '/dcm4chee-arc/aets/PACSHPN/rs/patients',
    }
    }
module.exports = {pacsConfig}
const fetch = require('node-fetch');
const moment = require('moment');

const token = process.env['ANDES_TOKEN'];

const HOST = 'https://demo.andes.gob.ar';

const profesionalDNI = process.argv[2];
const pacienteDNI = process.argv[3];

async function request(url, params) {
    const urlParams = new URLSearchParams(params);
    const res = await fetch(HOST + url + '?' + urlParams.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
        },
    });

    const data = await res.json();
    return data;
}

async function main() {
    const profesionales = await request('/api/core/tm/profesionales', { documento: profesionalDNI });
    const profesional = profesionales[0];

    const agendas = await request('/api/modules/turnos/agenda', {
        idProfesional: profesional.id,
        fechaDesde: moment().startOf('d').format(),
        fechaHasta: moment().endOf('d').format(),
        // estados: ['publicada', 'disponible'],
        estados: 'publicada',
        tipoPrestaciones: '598ca8375adc68e2a0c121bc'
    });

    let turnos = [];
    agendas.forEach(agenda => {
        agenda.bloques.forEach(bloque => {
            turnos = [...turnos, ...bloque.turnos];
        });
        turnos = [...turnos, ...agenda.sobreturnos];
    });

    // console.log(turnos)

    const turnosPaciente = turnos.filter(turno => turno.estado === 'asignado' && turno.paciente.documento === pacienteDNI);
    const turno = turnosPaciente[0];

    const csv = `${profesional.apellido} ${profesional.nombre}, ${profesional.documento}, ${turno.tipoPrestacion.term}, ${turno.paciente.id}, ${turno.paciente.apellido} ${turno.paciente.nombre}, ${turno.paciente.documento}, ${turno.paciente.sexo}, ${turno.paciente.fechaNacimiento.substring(0, 10)}`;

    console.log(csv)

}

main()
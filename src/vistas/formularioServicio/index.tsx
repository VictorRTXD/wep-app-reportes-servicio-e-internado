import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';

import Navegacion from '../../componentes/BarraNavegacion';

import config from '../../appConfig';
import '../../global.css';
import './styles.css';
import Modal, { DatosModal } from '../../componentes/Modal';

export default function CrearServicio() {
  const entidadReceptora = useRef<HTMLInputElement>(null);
  const receptor = useRef<HTMLInputElement>(null);
  const programa = useRef<HTMLInputElement>(null);
  const horaInicio = useRef<HTMLInputElement>(null);
  const horaFin = useRef<HTMLInputElement>(null);
  const [objetivosDelPrograma, setObjetivosDelPrograma] = useState('');

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });

  const [retornar, setRetornar] = useState<boolean>(false);
  const [redireccionamiento, setRedireccionamiento] = useState<string | null>(null);

  const datosGenerales = JSON.parse(sessionStorage.getItem('servicioDatosGenerales')!);

  let metodo = 'POST';

  if (datosGenerales) {
    if (Object.entries(datosGenerales).length > 0) {
      metodo = 'PUT';
    }
  }

  useEffect(() => {
    if (datosGenerales) {
      if (Object.entries(datosGenerales).length > 0) {
        entidadReceptora.current!.value = datosGenerales.entidadReceptora;
        receptor.current!.value = datosGenerales.receptor;
        programa.current!.value = datosGenerales.programa;
        horaInicio.current!.value = datosGenerales.horarioHoraInicio;
        horaFin.current!.value = datosGenerales.horarioHoraFin;

        setObjetivosDelPrograma(datosGenerales.objetivosDelPrograma);
        metodo = 'PUT';
      }
    }
  }, ['Esto solo se renderiza una vez']);

  function fechaACadena(fecha: Date): string {
    let cadenaFecha = '';

    cadenaFecha += fecha.getFullYear();
    cadenaFecha += `-${fecha.getMonth() + 1}`;
    cadenaFecha += `-${fecha.getDate()}`;
    return cadenaFecha;
  }

  function crearOActualizarServicio(e: any) {
    e.preventDefault();

    // Validar campos
    if (
      entidadReceptora.current?.value === ''
      || receptor.current?.value === ''
      || programa.current?.value === ''
      || horaInicio.current?.value === ''
      || horaFin.current?.value === ''
      || objetivosDelPrograma === ''
    ) {
      setDatosModal({
        tipo: 'error',
        texto: 'Uno o más de los datos enviados no son válidos',
        visibilidad: true,
        callback: () => {},
      });
    } else {
      // Si todos los campos estan bien, mandar solicitud
      let endpoint;

      if (metodo === 'POST') {
        endpoint = `${config.apiBaseUrl}/public/servicio`;
      } else {
        endpoint = `${config.apiBaseUrl}/public/servicio/1`; // Hardcode, id usuario. Cambiar a id servicio?
      }

      const servicio = {
        id: 1, // Hardcode
        idUsuario: 1, // Hardcode
        entidadReceptora: entidadReceptora.current?.value,
        receptor: receptor.current?.value,
        programa: programa.current?.value,
        objetivosDelPrograma,
        fechaInicio: fechaACadena(new Date()), // Hardcode
        fechaFin: fechaACadena(new Date()), // Hardcoe
        horarioHoraInicio: horaInicio.current?.value,
        horarioHoraFin: horaFin.current?.value,
      };

      fetch(endpoint, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((data) => {
          if (data) {
            const servicioDatosGenerales: any = {
              id: data.id,
              idUsuario: data.idUsuario,
              entidadReceptora: data.entidadReceptora,
              receptor: data.receptor,
              programa: data.programa,
              objetivosDelPrograma: data.objetivosDelPrograma,
              fechaInicio: data.fechaInicio || '',
              fechaFin: data.fechaFin || '',
              totalDeHoras: data.totalDeHoras || 0,
              horarioHoraInicio: data.horarioHoraInicio || '',
              horarioHoraFin: data.horarioHoraFin || '',
            };
            sessionStorage.setItem('servicioDatosGenerales', JSON.stringify(servicioDatosGenerales));
            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Datos Guardados',
              visibilidad: true,
              callback: () => {},
            });
            setRedireccionamiento('/');
          } else {
            setDatosModal({
              tipo: 'error',
              texto: 'Ocurrió un error',
              visibilidad: true,
              callback: () => {},
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);

          setDatosModal({
            tipo: 'error',
            texto: 'Ocurrió un error',
            visibilidad: true,
            callback: () => {},
          });
        });
    }
  }

  function manejarCambios(e: any) {
    setObjetivosDelPrograma(e.target.value);
  }

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => {},
    });
    setRetornar(true);
  }

  if (retornar && redireccionamiento) {
    return <Redirect to={redireccionamiento} />;
  }

  return (
    <div>
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        callback={cerrarModal}
      />

      <Navegacion />
      <br />
      <br />

      <h2>
        {metodo === 'POST' ? 'Crear ' : 'Actualizar '}
        Servicio
      </h2>
      <br />

      <div id="crear-servicio">
        <label id="entidadReceptora" htmlFor="entidadReceptora">
          Entidad Receptora:
          <input type="text" name="entidadReceptora" ref={entidadReceptora} />
        </label>
        <br />

        <label htmlFor="receptor">
          Receptor:
          <input type="text" name="receptor" ref={receptor} />
        </label>
        <br />

        <label htmlFor="programa">
          Programa:
          <input type="text" name="programa" ref={programa} />
        </label>
        <br />

        <label htmlFor="horaInicio">
          Hora de Inicio de la Jornada:
          <input type="time" name="horaInicio" ref={horaInicio} />
        </label>
        <br />

        <label htmlFor="horaFin">
          Hora de Fin de la Jornada:
          <input type="time" name="horaFin" ref={horaFin} />
        </label>
        <br />

        <label htmlFor="objetivosDelPrograma">
          Objeivos del Programa:
          <textarea
            name="objetivosDelPrograma"
            value={objetivosDelPrograma}
            onChange={manejarCambios}
          />
        </label>
        <br />

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarServicio}> Guardar </button>
      </div>

    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';

import config from '../../appConfig';
import '../../global.css';
import './styles.css';
import Modal, { DatosModal } from '../../componentes/Modal';

export default function CrearServicio() {
  const entidadReceptora = useRef<HTMLInputElement>(null);
  const receptor = useRef<HTMLInputElement>(null);
  const programa = useRef<HTMLInputElement>(null);
  const fechaInicio = useRef<HTMLInputElement>(null);
  const fechaFin = useRef<HTMLInputElement>(null);
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
  const token = sessionStorage.getItem('token');

  let ok: boolean;
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
        fechaInicio.current!.value = datosGenerales.fechaInicio;
        fechaFin.current!.value = datosGenerales.fechaFin;
        horaInicio.current!.value = datosGenerales.horarioHoraInicio;
        horaFin.current!.value = datosGenerales.horarioHoraFin;

        setObjetivosDelPrograma(datosGenerales.objetivosDelPrograma);
        metodo = 'PUT';
      }
    }
  }, []);

  // function fechaACadena(fecha: Date): string {
  //   let cadenaFecha = '';

  //   cadenaFecha += fecha.getFullYear();
  //   cadenaFecha += `-${fecha.getMonth() + 1}`;
  //   cadenaFecha += `-${fecha.getDate()}`;
  //   return cadenaFecha;
  // }

  function crearOActualizarServicio(e: any) {
    e.preventDefault();

    // Validar campos
    if (
      entidadReceptora.current?.value === ''
      || receptor.current?.value === ''
      || programa.current?.value === ''
      || fechaInicio.current?.value === ''
      || fechaFin.current?.value === ''
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

      const servicio = {
        entidadReceptora: entidadReceptora.current?.value,
        receptor: receptor.current?.value,
        programa: programa.current?.value,
        objetivosDelPrograma,
        fechaInicio: fechaInicio.current?.value,
        fechaFin: fechaFin.current?.value,
        horarioHoraInicio: horaInicio.current?.value,
        horarioHoraFin: horaFin.current?.value,
      };

      fetch(`${config.apiBaseUrl}/public/servicio`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      })
        .then((response) => {
          ok = response.ok;
          return response.json();
        })
        .then((data) => {
          if (ok) {
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
            setRedireccionamiento('/usuario/iniciar-sesion');

            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Datos Guardados. Deberas iniciar sesión de nuevo',
              visibilidad: true,
              callback: () => {},
            });
          } else if (data.code) {
            if (data.code === 'SESION_EXPIRADA') {
              setDatosModal({
                tipo: 'error',
                texto: data.code,
                visibilidad: true,
                callback: () => {},
              });
              setRedireccionamiento('/usuario/iniciar-sesion');
            } else {
              setDatosModal({
                tipo: 'error',
                texto: data.code,
                visibilidad: true,
                callback: () => {},
              });
            }
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

    if (redireccionamiento) {
      setRetornar(true);
    }
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
        // eslint-disable-next-line react/jsx-no-bind
        callback={cerrarModal}
      />

      <div className="title-bar centrar"><span><b>Reportes Área de la Salud</b></span></div>
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
          <input type="text" name="entidadReceptora" className="input-servicio" ref={entidadReceptora} />
        </label>
        <br />

        <label htmlFor="receptor">
          Receptor:
          <input type="text" name="receptor" className="input-servicio" ref={receptor} />
        </label>
        <br />

        <label htmlFor="programa">
          Programa:
          <input type="text" name="programa" className="input-servicio" ref={programa} />
        </label>
        <br />

        <label htmlFor="fechaInicio">
          Fecha Inicio:
          <input type="date" name="fechaInicio" className="input-servicio" ref={fechaInicio} />
        </label>
        <br />

        <label htmlFor="fechaFin">
          Fecha Fin:
          <input type="date" name="fechaFin" className="input-servicio" ref={fechaFin} />
        </label>
        <br />

        <label htmlFor="horaInicio">
          Hora de Inicio de la Jornada:
          <input type="time" name="horaInicio" className="input-servicio" ref={horaInicio} />
        </label>
        <br />

        <label htmlFor="horaFin">
          Hora de Fin de la Jornada:
          <input type="time" name="horaFin" className="input-servicio" ref={horaFin} />
        </label>
        <br />

        <label htmlFor="objetivosDelPrograma">
          Objetivos del Programa:
          <textarea
            name="objetivosDelPrograma"
            value={objetivosDelPrograma}
            onChange={manejarCambios}
            className="textarea-servicio"
          />
        </label>
        <br />

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarServicio}> Guardar </button>
        <br />
        <br />

      </div>
    </div>
  );
}

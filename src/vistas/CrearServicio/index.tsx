import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';

import Navegacion from '../../componentes/BarraNavegacion';

import config from '../../appConfig';
import '../../global.css';
import './styles.css';

export default function CrearServicio() {
  let servicio: any;
  const entidadReceptora = useRef<HTMLInputElement>(null);
  const receptor = useRef<HTMLInputElement>(null);
  const programa = useRef<HTMLInputElement>(null);
  const [formulario, setFormulario] = useState({
    horaInicio: 0,
    horaFin: 0,
    objetivosDelPrograma: '',
  });

  let redirect = null;
  let servicioExiste: boolean = false;

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/public/servicio/1`)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          // eslint-disable-next-line no-console
          return false;
        }
        servicioExiste = true;
        return response.json();
      })
      .then((data) => {
        servicio = data;
        try {
          entidadReceptora.current!.value = servicio.entidadReceptora;
          receptor.current!.value = servicio.receptor;
          programa.current!.value = servicio.programa;

          setFormulario({
            horaInicio: parseInt(servicio.horarioHoraInicio.split(':').pop(), 10),
            horaFin: parseInt(servicio.horarioHoraFin.split(':').pop(), 10),
            objetivosDelPrograma: servicio.objetivosDelPrograma,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, [config.apiBaseUrl,
    formulario.horaFin,
    formulario.horaInicio,
    formulario.objetivosDelPrograma]);

  function fechaACadena(fecha: Date): string {
    let cadenaFecha = '';

    cadenaFecha += fecha.getFullYear();
    cadenaFecha += `-${fecha.getMonth() + 1}`;
    cadenaFecha += `-${fecha.getDate()}`;
    return cadenaFecha;
  }

  function crearOActualizarServicio(e: any) {
    e.preventDefault();

    servicio = {
      idUsuario: 1,
      entidadReceptora: entidadReceptora.current?.value,
      receptor: receptor.current?.value,
      programa: programa.current?.value,
      objetivosDelPrograma: formulario.objetivosDelPrograma,
      fechaInicio: fechaACadena(new Date()),
      fechaFin: fechaACadena(new Date()),
      totalDeHoras: 0,
      horarioHoraInicio: formulario.horaInicio,
      horarioHoraFin: formulario.horaFin,
    };

    const method = servicioExiste ? 'PUT' : 'POST';

    fetch(`${config.apiBaseUrl}/public/servicio`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servicio),
    })
      .then((response) => response.json())
      .then((data) => {
        servicio = data;
        redirect = <Redirect to="/" />;
        // eslint-disable-next-line no-console
        console.log(servicio);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  function inputOnChange(e: any) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  }

  function numberInputOnChange(e: any) {
    e.preventDefault();
    const regex = /^[0-9\b]+$/;
    if (e.target.value.match(regex)) {
      setFormulario({
        ...formulario,
        [e.target.name]: e.target.value,
      });
    }
  }

  if (redirect) {
    return redirect;
  }

  return (
    <div>
      <Navegacion />
      <br />

      <h2>Bienvenido!</h2>
      <h2>
        Parece que no has ingresado algunos datos acerca del tu servicio o internado,
        ¡Comencemos!
      </h2>
      <br />

      <form onSubmit={crearOActualizarServicio}>
        <label htmlFor="entidadReceptora">
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
          <input
            type="number"
            name="horaInicio"
            value={formulario.horaInicio}
            placeholder="Escribe solo números entre 0 y 23"
            min="0"
            max="23"
            onChange={numberInputOnChange}
          />
        </label>
        <br />

        <label htmlFor="horaFin">
          Hora de Fin de la Jornada:
          <input
            type="number"
            name="horaFin"
            value={formulario.horaFin}
            placeholder="Escribe solo números entre 0 y 23"
            min="0"
            max="23"
            onChange={numberInputOnChange}
          />
        </label>
        <br />

        <label htmlFor="objetivosDelPrograma">
          Objeivos del Programa:
          <textarea
            name="objetivosDelPrograma"
            value={formulario.objetivosDelPrograma}
            onChange={inputOnChange}
          />
        </label>
        <br />

        <input type="submit" value="Guardar" />
      </form>

    </div>
  );
}

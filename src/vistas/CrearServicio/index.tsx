import React, { useRef, useState } from 'react';
import Encabezado from '../../componentes/BarraNavegacion';

import '../../global.css';
import './styles.css';
// import { ReporteParcial } from '../../resources';

export default function CrearServicio() {
  const entidadReceptora = useRef<HTMLInputElement>(null);
  const receptor = useRef<HTMLInputElement>(null);
  const programa = useRef<HTMLInputElement>(null);
  const [formulario, setFormulario] = useState({
    horaInicio: 0,
    horaFin: 0,
    objetivosDelPrograma: '',
  });

  function crearServicio(e: any) {
    e.preventDefault();
    // console.log(entidadReceptora.current?.value);
    // Crear Servicio Request
    // Redirigir a la página princpal
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

  return (
    <div>
      <Encabezado />
      <br />
      <h1>Bienvenido!</h1>
      <h2>
        Parece que no has ingresado algunos datos acerca del tu servicio o internado,
        ¡Comencemos!
      </h2>
      <br />

      <form onSubmit={crearServicio}>
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

        <label htmlFor="programa">
          Programa:
          <input type="text" name="programa" ref={programa} />
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

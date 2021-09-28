/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';

import Navegacion from '../../../componentes/BarraNavegacion';

import config from '../../../appConfig';
import '../../../global.css';

export default function ReporteFinal() {
  const fechaInicio = useRef<HTMLInputElement>(null);
  const fechaFin = useRef<HTMLInputElement>(null);
  const [totalHoras, setTotalHoras] = useState(0);
  let method = 'POST';
  let servicio;

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/public/servicio/1`)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          // eslint-disable-next-line no-console
          return false;
        }
        // Set formulario a los datos q llegaron
        return response.json();
      })
      .then((data) => {
        servicio = data;
        method = 'PUT';
        // eslint-disable-next-line no-console
        console.log(servicio);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, [config.apiBaseUrl]);

  function crearOActualizarReporte() {
    let reporte = {
      fechaInicio: fechaInicio.current?.value,
      fechaFin: fechaFin.current?.value,
      totalHoras,
    };

    fetch(`${config.apiBaseUrl}/public/reporte-final-2`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reporte),
    })
      .then((response) => response.json())
      .then((data) => {
        reporte = data;
        // eslint-disable-next-line no-console
        console.log(reporte);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  function numberInputOnChange(e: any) {
    e.preventDefault();
    const regex = /^[0-9\b]+$/;
    if (e.target.value.match(regex)) {
      setTotalHoras(e.target.value);
    }
  }

  return (
    <div>
      <Navegacion />

      <form>
        <label htmlFor="totaLHoras">
          Total de Horas:
          <input
            type="number"
            name="totaLHoras"
            value={totalHoras}
            min="0"
            onChange={numberInputOnChange}
          />
        </label>
        <br />

        <label htmlFor="fechaInicio">
          Fecha Inicio:
          <input
            type="date"
            name="fechaInicio"
            ref={fechaInicio}
          />
        </label>
        <br />

        <label htmlFor="fechaFin">
          Fecha Fin:
          <input
            type="date"
            name="fechaFin"
            ref={fechaFin}
          />
        </label>
        <br />

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarReporte}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

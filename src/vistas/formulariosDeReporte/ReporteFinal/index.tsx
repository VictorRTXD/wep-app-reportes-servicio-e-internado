/* eslint-disable react/no-array-index-key */
import React, { useRef } from 'react';

import Navegacion from '../../../componentes/BarraNavegacion';

import config from '../../../appConfig';
import '../../../global.css';

export default function ReporteFinal() {
  const fechaInicio = useRef<HTMLInputElement>(null);
  const fechaFin = useRef<HTMLInputElement>(null);

  function crearOActualizarReporte() {
    let reporte = {
      fechaInicio: fechaInicio.current?.value,
      fechaFin: fechaFin.current?.value,
    };

    fetch(`${config.apiBaseUrl}/public/servicio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reporte),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return null;
      })
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

  return (
    <div>
      <Navegacion />

      <form>
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

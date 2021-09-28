/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';

import Navegacion from '../../../componentes/BarraNavegacion';

import config from '../../../appConfig';
import '../../../global.css';
import './styles.css';

export default function ReporteFinal2() {
  const [formulario, setFormulario] = useState({
    metasAlcanzadas: '',
    metodologiaUtilizada: '',
    innovacionAportada: '',
    conclusiones: '',
    propuestas: '',
  });

  let reporteExiste: boolean = false;

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/public/reporte-fina-2/1`)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          // eslint-disable-next-line no-console
          return false;
        }
        reporteExiste = true;
        return response.json();
      })
      .then((data) => {
        setFormulario({
          metasAlcanzadas: data.metasAlcanzadas,
          metodologiaUtilizada: data.metodologiaUtilizada,
          innovacionAportada: data.innovacionAportada,
          conclusiones: data.conclusiones,
          propuestas: data.propuestas,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, [formulario.metasAlcanzadas,
    formulario.metodologiaUtilizada,
    formulario.innovacionAportada,
    formulario.conclusiones,
    formulario.propuestas,
  ]);

  function crearOActualizarReporte() {
    let reporte = {
      metasAlcanzadas: formulario.metasAlcanzadas,
      metodologiaUtilizada: formulario.metodologiaUtilizada,
      innovacionAportada: formulario.innovacionAportada,
      conclusiones: formulario.conclusiones,
      propuestas: formulario.propuestas,
    };

    const method = reporteExiste ? 'PUT' : 'POST';

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

  function inputOnChange(e: any) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      <Navegacion />

      <form>
        <label htmlFor="metasAlcanzadas">
          Metas Alcanzadas:
          <textarea
            name="metasAlcanzadas"
            value={formulario.metasAlcanzadas}
            onChange={inputOnChange}
          />
        </label>

        <label htmlFor="metodologiaUtilizada">
          Metodología Utilizada:
          <textarea
            name="metodologiaUtilizada"
            value={formulario.metodologiaUtilizada}
            onChange={inputOnChange}
          />
        </label>

        <label htmlFor="innovacionAportada">
          Innovación Aportada:
          <textarea
            name="innovacionAportada"
            value={formulario.innovacionAportada}
            onChange={inputOnChange}
          />
        </label>

        <label htmlFor="conclusiones">
          Conclusiones:
          <textarea
            name="conclusiones"
            value={formulario.conclusiones}
            onChange={inputOnChange}
          />
        </label>

        <label htmlFor="propuestas">
          Propuestas:
          <textarea
            name="propuestas"
            value={formulario.propuestas}
            onChange={inputOnChange}
          />
        </label>

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarReporte}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

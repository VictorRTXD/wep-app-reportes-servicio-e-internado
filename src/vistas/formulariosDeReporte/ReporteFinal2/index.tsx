/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

import Navegacion from '../../../componentes/BarraNavegacion';

import config from '../../../appConfig';
import '../../../global.css';
import './styles.css';
import Modal, { DatosModal } from '../../../componentes/Modal';

export default function ReporteFinal2() {
  const [formulario, setFormulario] = useState({
    metasAlcanzadas: '',
    metodologiaUtilizada: '',
    innovacionAportada: '',
    conclusiones: '',
    propuestas: '',
  });

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const reporteFinalDos = JSON.parse(sessionStorage.getItem('reporteFinalDos')!);

  let metodo = 'POST';

  useEffect(() => {
    if (Object.entries(reporteFinalDos).length > 0) {
      metodo = 'PUT';

      setFormulario({
        metasAlcanzadas: reporteFinalDos.metasAlcanzadas,
        metodologiaUtilizada: reporteFinalDos.metodologiaUtilizada,
        innovacionAportada: reporteFinalDos.innovacionAportada,
        conclusiones: reporteFinalDos.conclusiones,
        propuestas: reporteFinalDos.propuestas,
      });
    }
  }, ['Esto solo se ejecuta una vez']);

  function crearOActualizarReporte() {
    // Validar datos
    if (formulario.metasAlcanzadas !== ''
    && formulario.metodologiaUtilizada !== ''
    && formulario.innovacionAportada !== ''
    && formulario.conclusiones !== ''
    && formulario.propuestas !== ''
    ) {
      // Hardcode
      // Ni si quiera hay un usuario
      let reporte = {
        metasAlcanzadas: formulario.metasAlcanzadas,
        metodologiaUtilizada: formulario.metodologiaUtilizada,
        innovacionAportada: formulario.innovacionAportada,
        conclusiones: formulario.conclusiones,
        propuestas: formulario.propuestas,
      };

      fetch(`${config.apiBaseUrl}/public/reporte-final-2`, {
        method: metodo,
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
          // eslint-disable-next-line no-console

          if (data.reporteFinalDos) {
            sessionStorage.setItem('reporteFinalDos', JSON.stringify(data.reporteFinalDos));

            reporte = data;

            setFormulario({
              metasAlcanzadas: reporte.metasAlcanzadas,
              metodologiaUtilizada: reporte.metodologiaUtilizada,
              innovacionAportada: reporte.innovacionAportada,
              conclusiones: reporte.conclusiones,
              propuestas: reporte.propuestas,
            });

            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Guardador',
              visibilidad: true,
              callback: () => {},
            });

            setRedireccionamiento('/reportes-final-2');
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
    } else {
      setDatosModal({
        tipo: 'error',
        texto: 'Uno o mas datos son vacios',
        visibilidad: true,
        callback: () => {},
      });
    }
  }

  function manejarCambios(e: any) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
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

      <form>
        <label htmlFor="metasAlcanzadas">
          Metas Alcanzadas:
          <textarea
            name="metasAlcanzadas"
            value={formulario.metasAlcanzadas}
            onChange={manejarCambios}
          />
        </label>

        <label htmlFor="metodologiaUtilizada">
          Metodología Utilizada:
          <textarea
            name="metodologiaUtilizada"
            value={formulario.metodologiaUtilizada}
            onChange={manejarCambios}
          />
        </label>

        <label htmlFor="innovacionAportada">
          Innovación Aportada:
          <textarea
            name="innovacionAportada"
            value={formulario.innovacionAportada}
            onChange={manejarCambios}
          />
        </label>

        <label htmlFor="conclusiones">
          Conclusiones:
          <textarea
            name="conclusiones"
            value={formulario.conclusiones}
            onChange={manejarCambios}
          />
        </label>

        <label htmlFor="propuestas">
          Propuestas:
          <textarea
            name="propuestas"
            value={formulario.propuestas}
            onChange={manejarCambios}
          />
        </label>

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarReporte}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

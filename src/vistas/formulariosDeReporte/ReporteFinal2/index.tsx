/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Redirect } from 'react-router';

import Navegacion from '../../../componentes/BarraNavegacion';

import config from '../../../appConfig';
import '../../../global.css';
import './styles.css';
import Modal, { DatosModal } from '../../../componentes/Modal';

export default function ReporteFinal2() {
  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const reporteFinalDos = JSON.parse(sessionStorage.getItem('reporteFinalDos')!);

  const token = sessionStorage.getItem('token');

  let metodo = 'POST';
  let ok: boolean;

  let formularioAux = {
    metasAlcanzadas: '',
    metodologiaUtilizada: '',
    innovacionAportada: '',
    conclusiones: '',
    propuestas: '',
  };

  if (Object.entries(reporteFinalDos).length > 0) {
    metodo = 'PUT';

    formularioAux = {
      metasAlcanzadas: reporteFinalDos.metasAlcanzadas,
      metodologiaUtilizada: reporteFinalDos.metodologiaUtilizada,
      innovacionAportada: reporteFinalDos.innovacionAportada,
      conclusiones: reporteFinalDos.conclusiones,
      propuestas: reporteFinalDos.propuestas,
    };
  }

  const [formulario, setFormulario] = useState(formularioAux);

  function crearOActualizarReporte() {
    // Validar datos
    if (formulario.metasAlcanzadas === ''
    || formulario.metodologiaUtilizada === ''
    || formulario.innovacionAportada === ''
    || formulario.conclusiones === ''
    || formulario.propuestas === ''
    ) {
      setDatosModal({
        tipo: 'error',
        texto: 'Uno o mas datos son vacios',
        visibilidad: true,
        callback: () => {},
      });
    } else {
      const reporte = {
        id: metodo === 'PUT' ? reporteFinalDos.id : 0,
        metasAlcanzadas: formulario.metasAlcanzadas,
        metodologiaUtilizada: formulario.metodologiaUtilizada,
        innovacionAportada: formulario.innovacionAportada,
        conclusiones: formulario.conclusiones,
        propuestas: formulario.propuestas,
      };

      fetch(`${config.apiBaseUrl}/public/reporte-final-2`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporte),
      })
        .then((response) => {
          ok = response.ok;
          return response.json();
        })
        .then((data) => {
          // eslint-disable-next-line no-console

          if (ok) {
            sessionStorage.setItem('reporteFinalDos', JSON.stringify(data));

            setRedireccionamiento('/reporte-final');

            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Guardado',
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
              if (redireccionamiento === '') {
                setRedireccionamiento('/usuario/iniciar-sesion');
              }
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

      <Navegacion />
      <br />

      <h2 className="texto-encabezado">Formulario Reporte Final</h2>
      <br />

      <form>
        <label htmlFor="metasAlcanzadas">
          Metas Alcanzadas:
          <textarea
            name="metasAlcanzadas"
            value={formulario.metasAlcanzadas}
            onChange={manejarCambios}
            className="textarea-final"
          />
        </label>

        <label htmlFor="metodologiaUtilizada">
          Metodología Utilizada:
          <textarea
            name="metodologiaUtilizada"
            value={formulario.metodologiaUtilizada}
            onChange={manejarCambios}
            className="textarea-final"
          />
        </label>

        <label htmlFor="innovacionAportada">
          Innovación Aportada:
          <textarea
            name="innovacionAportada"
            value={formulario.innovacionAportada}
            onChange={manejarCambios}
            className="textarea-final"
          />
        </label>

        <label htmlFor="conclusiones">
          Conclusiones:
          <textarea
            name="conclusiones"
            value={formulario.conclusiones}
            onChange={manejarCambios}
            className="textarea-final"
          />
        </label>

        <label htmlFor="propuestas">
          Propuestas:
          <textarea
            name="propuestas"
            value={formulario.propuestas}
            onChange={manejarCambios}
            className="textarea-final"
          />
        </label>

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizarReporte}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

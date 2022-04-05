import React from 'react';

import '../../global.css';
import './styles.css';
import OMG from '../../recursos/OMG.png';
import Hecho from '../../recursos/hecho.png';

export interface DatosModal {
  tipo: 'confirmacion' | 'error' | null
  texto: string
  visibilidad: boolean
  callback(): void
}

export default function Modal(props: any) {
  const { tipo } = props;
  const { texto } = props;
  const { visibilidad } = props;
  const { callback } = props;

  let modal;
  let display = 'none';

  if (visibilidad === true) {
    display = 'block';
  }

  function cerrar() {
    if (callback) {
      callback();
    }
  }

  switch (tipo) {
    case 'confirmacion':
      modal = (
        <div className="Modal">
          <br />

          <h2 className="modal-message">{texto}</h2>
          <br />

          <img id="img-hecho" className="img" src={Hecho} alt="Hecho" />
          <br />

          <button type="button" onClick={cerrar} id="btn-modal" className="btn-primario">Ok</button>
        </div>
      );
      break;
    case 'error':
      modal = (
        <div className="Modal">
          <br />

          <img className="img" src={OMG} alt="OMG" />
          <h2 className="modal-message">Ha ocurrido un error.</h2>
          <br />
          <br />

          <h2 className="modal-txt">{texto}</h2>
          <br />

          <button type="button" onClick={cerrar} id="btn-modal" className="btn-terciario">Cerrar</button>
        </div>
      );
      break;
    default:
      modal = (
        <div className="Modal centrar">
          <br />

          <h2>{texto}</h2>
          <br />

          <button type="button" onClick={cerrar} id="btn-modal" className="btn-primario">Ok</button>
        </div>
      );
      break;
  }

  return (
    <>
      <div style={{ display }}>
        <div id="fondo-modal" />

        {modal}
      </div>
    </>
  );
}

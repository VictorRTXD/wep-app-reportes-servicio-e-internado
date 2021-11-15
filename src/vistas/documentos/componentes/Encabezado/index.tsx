import React from 'react';

import '../../../../global.css';
import './styles.css';

import escudo from '../../../../recursos/escudo.png';

export default function EncabezadoDocumentos() {
  return (
    <div id="encabezado">
      <div id="ctn-escudo">
        <img id="escudo" src={escudo} alt="escudo-udg" />
      </div>

      <div id="ctn-titulos">
        <h1>UNIVERSIDAD DE GUADALAJARA</h1>
        <h3 className="centro-universitario">Centro Universitario de los Altos</h3>
        <h3>Secretaria Académica</h3>
        <h3>Coordinación de Extensión</h3>
        <h3>Unidad de Servicio Social</h3>
      </div>

    </div>
  );
}

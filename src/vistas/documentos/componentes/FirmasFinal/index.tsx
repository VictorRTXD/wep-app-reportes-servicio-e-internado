import React from 'react';

import '../../../../global.css';
import './styles.css';

export default function FirmasDocumentos() {
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);
  return (
    <div className="ctn-firmas" id="ctn-firmas">
      <div className="ctn-firma">
        <hr />
        <br />
        <span>{usuario.nombre}</span>
        <br />
        <span>ㅤ</span>
      </div>

      <div className="ctn-firma">
        <hr />
        <br />
        <span>Lic. Omar Saúl González Romo</span>
        <br />
        <span>Jefe de la Unidad de Servicio Social</span>
      </div>

      <div className="ctn-firma">
        <hr />
        <span>
          <br />
          Nombre y firma del Jefe De Enseñanza o Receptor y sello institucional de
          la Dependencia receptora
        </span>
      </div>
    </div>
  );
}

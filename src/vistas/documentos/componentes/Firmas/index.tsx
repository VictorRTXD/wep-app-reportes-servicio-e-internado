import React from 'react';

import '../../../../global.css';
import './styles.css';

export default function FirmasDocumentos() {
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);
  return (
    <div className="ctn-firmas" id="ctn-firmas">
      <div className="ctn-firma">
        <hr />
        <span>{usuario.nombre}</span>
      </div>

      <div className="ctn-firma">
        <hr />
        <span>SELLO DE LA INSTITUCIÓN</span>
      </div>

      <div className="ctn-firma">
        <hr />
        <span>JEFE DE ENSEÑANZA O RECEPTOR</span>
      </div>
    </div>
  );
}

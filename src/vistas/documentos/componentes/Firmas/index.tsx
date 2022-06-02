import React from 'react';

import '../../../../global.css';
import './styles.css';

const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

export default function FirmasDocumentos() {
  return (
    <div className="ctn-firmas">
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

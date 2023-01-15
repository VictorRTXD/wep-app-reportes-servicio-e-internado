import React from 'react';
import { Link } from 'react-router-dom';
import '../../global.css';
import './styles.css';

export default function Navegacion() {
  // eslint-disable-next-line no-console

  return (
    <>
      <div id="ctn-barra-navegacion">
        <div className="title-bar centrar"><span><b>Reportes Área de la Salud</b></span></div>
        <div className="buttons-container">
          <Link to="/usuario/iniciar-sesion" onClick={() => sessionStorage.clear()} type="button" className="link-redondo link-texto-largo centrar"> Cerrar Sesion </Link>
          <Link to="/servicio/formulario" type="button" id="servicio" className="link-redondo link-texto-largo centrar"> Servicio </Link>
          <Link to="/reportes-parciales/1" type="button" className="link-redondo"> 1 </Link>
          <Link to="/reportes-parciales/2" type="button" className="link-redondo"> 2 </Link>
          <Link to="/reportes-parciales/3" type="button" className="link-redondo"> 3 </Link>
          <Link to="/reportes-parciales/4" type="button" className="link-redondo"> 4 </Link>
          <Link to="/reporte-final" type="button" className="link-redondo link-texto-largo centrar"> Final</Link>
        </div>
      </div>
    </>
  );
}

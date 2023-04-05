import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../global.css';
import './styles.css';
import caduceo from '../../recursos/caduceo.png';
import menu from '../../recursos/lista.png';

interface IProps{
  select: number
}

export default function Navegacion(props:IProps) {
  // eslint-disable-next-line no-console
  const { select } = props;
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };
  return (
    <>
      <button type="button" className="menu-icon" onClick={handleMenuClick} aria-label="menu">
        <img src={menu} alt="menu logo" id="img-icon" />
      </button>
      <div className={(showMenu === true && window.innerWidth <= 768) ? 'title-bar1' : 'title-bar'}>
        <button type="button" className="menu-icon" onClick={handleMenuClick} aria-label="menu">
          <img src={menu} alt="menu logo" id="img-icon" style={{ width: 20, height: 20 }} />
        </button>
        {(window.innerWidth <= 768) ? (<br />) : (<></>)}
        <div>
          <span style={{ marginTop: '3%', marginBottom: '3%' }}>
            <b>
              Reportes Área

              <br />
              de la Salud
            </b>
          </span>
          <br />
          <img src={caduceo} alt="cauduceo logo" style={{ width: '20%', margin: '0 auto', marginTop: '5%' }} />
        </div>
        <Link to="/servicio/formulario" type="button" id="servicio" className={(select === 0) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> Servicio </Link>
        <Link to="/reportes-parciales/1" type="button" className={(select === 1) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> 1 </Link>
        <Link to="/reportes-parciales/2" type="button" className={(select === 2) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> 2 </Link>
        <Link to="/reportes-parciales/3" type="button" className={(select === 3) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> 3 </Link>
        <Link to="/reportes-parciales/4" type="button" className={(select === 4) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> 4 </Link>
        <Link to="/reporte-final" type="button" className={(select === 5) ? 'link-seleccionado link-texto-largo centrar' : 'link-redondo link-texto-largo centrar'}> Final</Link>
        <Link to="/usuario/iniciar-sesion" onClick={() => sessionStorage.clear()} type="button" className="link-redondo link-texto-largo centrar"> Cerrar Sesion </Link>
      </div>
    </>
  );
}

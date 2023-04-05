import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import caduceo from '../../recursos/caduceo.png';
import menu from '../../recursos/lista.png';
import '../../global.css';
import './styles.css';

export default function MenuHamburguesa() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="menu-container">
      <button type="button" className="menu-icon" onClick={handleMenuClick}>
        <img src={menu} alt="menu logo" style={{ width: '20%', margin: '0 auto', marginTop: '5%' }} />
        <div className={showMenu ? 'menu-line menu-line-top-active' : 'menu-line'} />
        <div className={showMenu ? 'menu-line menu-line-middle-active' : 'menu-line'} />
        <div className={showMenu ? 'menu-line menu-line-bottom-active' : 'menu-line'} />
      </button>
      {showMenu ? (
        <div className="menu-links">
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
          <Link to="/servicio/formulario" className="link-texto-largo centrar">
            Servicio
          </Link>
          <Link to="/reportes-parciales/1" className="link-texto-largo centrar">
            1
          </Link>
          <Link to="/reportes-parciales/2" className="link-texto-largo centrar">
            2
          </Link>
          <Link to="/reportes-parciales/3" className="link-texto-largo centrar">
            3
          </Link>
          <Link to="/reportes-parciales/4" className="link-texto-largo centrar">
            4
          </Link>
          <Link to="/reporte-final" className="link-texto-largo centrar">
            Final
          </Link>
          <Link to="/usuario/iniciar-sesion" onClick={() => sessionStorage.clear()} className="link-texto-largo centrar">
            Cerrar Sesion
          </Link>
        </div>
      ) : null}
    </div>
  );
}

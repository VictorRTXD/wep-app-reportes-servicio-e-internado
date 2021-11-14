import React, { useRef, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Modal, { DatosModal } from '../../../componentes/Modal';
import config from '../../../appConfig';

import '../../../global.css';
import './styles.css';

export default function InicioSesion() {
  const nombreUsuario = useRef<HTMLInputElement>(null);
  const contrasena = useRef<HTMLInputElement>(null);

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  let ok: boolean;

  function inciarSesion() {
    if (nombreUsuario.current?.value !== ''
    && contrasena.current?.value !== '') {
      fetch(`${config.apiBaseUrl}/public/usuarios/iniciar-sesion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreUsuario: nombreUsuario.current?.value,
          contrasena: contrasena.current?.value,
        }),
      })
        .then((response) => {
          ok = response.ok;
          return response.json();
        })
        .then((data) => {
          if (ok) {
            if (data.token) {
              sessionStorage.setItem('token', data.token);
            }
            setRedireccionamiento('/');
            setRetornar(true);
          } else if (data.code) {
            setDatosModal({
              tipo: 'error',
              texto: data.code,
              visibilidad: true,
              callback: () => {},
            });
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
            texto: 'No se puedo conectar al servidor',
            visibilidad: true,
            callback: () => {},
          });
        });
    }
  }

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => {},
    });
  }

  if (retornar && redireccionamiento) {
    return <Redirect to={redireccionamiento} />;
  }

  return (
    <>
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        callback={cerrarModal}
      />

      <div className="title-bar"><span>Reportes Area de la Salud</span></div>
      <br />
      <br />

      <h2 className="texto-encabezado">Iniciar Sesión</h2>

      <div className="ctn-con-padding">
        <label id="nombreUsuario" htmlFor="nombreUsuario">
          Nombre de Usuario:
          <input type="text" name="nombreUsuario" ref={nombreUsuario} />
        </label>
        <br />

        <label id="contrasena" htmlFor="contrasena">
          Contraseña:
          <input type="text" name="contrasena" ref={contrasena} />
        </label>
        <br />

        <button type="button" className="btn-primario" onClick={inciarSesion}> Iniciar Sesión </button>
        <div id="ctn-btn-registro" className="ctn-btn-link">
          <Link to="/usuario/info" type="button" className="btn-secundario btn-link"> Registo </Link>
        </div>
        <br />
        <br />

        <Link id="link-olvidaste-contrasena" to="/usuario/info/actualizar" type="button"> ¿Olvidaste tu contraseña? </Link>

        <br />
      </div>
    </>
  );
}

import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal, { DatosModal } from '../../componentes/Modal';
import config from '../../appConfig';

import '../../global.css';

export default function InicioSesion() {
  const codigo = useRef<HTMLInputElement>(null);
  const nip = useRef<HTMLInputElement>(null);

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
    if (codigo.current?.value !== ''
    && nip.current?.value !== '') {
      fetch(`${config.apiBaseUrl}/public/usuarios/iniciar-sesion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: codigo.current?.value,
          nip: nip.current?.value,
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

            fetch(`${config.apiBaseUrl}/public/usuarios?codigo=${codigo.current?.value}&nip=${nip.current?.value}`, {
              method: 'GET',
            })
              .then((response) => response.json())
              .then((dataUsuario) => {
                // eslint-disable-next-line no-console
                console.log(dataUsuario);
                sessionStorage.setItem('usuario', JSON.stringify(dataUsuario || []));
              })
              .catch(() => {
                // eslint-disable-next-line no-console
                console.log('No se pudo obtener el usuario');
              });

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
            texto: 'No se pudo conectar al servidor',
            visibilidad: true,
            callback: () => {},
          });
        });
    }
  }

  function enter(e: any) {
    if (e.key === 'Enter') {
      inciarSesion();
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

      <div className="title-bar centrar"><span>Reportes Área de la Salud</span></div>
      <br />
      <br />

      <h2 className="texto-encabezado">Iniciar Sesión</h2>

      <div className="ctn-con-padding">
        <label id="codigo" className="label-sesion" htmlFor="codigo">
          Código de alumno:
          <input type="text" className="input-sesion" name="codigo" ref={codigo} />
        </label>
        <br />

        <label id="nip" className="label-sesion" htmlFor="nip">
          NIP:
          <input type="password" onKeyDown={enter} className="input-sesion" name="nip" ref={nip} />
        </label>
        <br />

        <button type="button" className="btn-primario iniciar-sesion" onClick={inciarSesion}> Iniciar Sesión </button>
        <br />
      </div>
    </>
  );
}

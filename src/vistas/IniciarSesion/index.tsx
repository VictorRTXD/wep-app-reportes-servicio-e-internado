import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal, { DatosModal } from '../../componentes/Modal';
import config from '../../appConfig';

import '../../global.css';
import {
  DIV,
  CL,
  ContainerInput,
  ContainerLogin,
  ContainerName,
  ContainerTitle,
  Title,
} from './LoginStyle';
import udgblanco from '../../recursos/udgblanco.png';
import caduceo from '../../recursos/caduceo.png';

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
              texto: 'ERROR DE LA BASE DE DATOS',
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
    <div>
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        callback={cerrarModal}
      />

      <DIV>
        <ContainerLogin>

          <ContainerInput>
            <CL>
              <Title color="#E07C43" size="350%">Iniciar Sesión</Title>
              <br />
              <br />
              <br />
              <br />
              <label id="codigo" className="label-sesion" htmlFor="codigo">
                Código de alumno:
                <input type="text" className="input-sesion" name="codigo" ref={codigo} placeholder="Ingrese su código" />
              </label>
              <br />
              <br />

              <label id="nip" className="label-sesion" htmlFor="nip">
                NIP:
                <input type="password" onKeyDown={enter} className="input-sesion" name="nip" ref={nip} placeholder="Ingrese su NIP" />
              </label>
              <br />
              <br />

              <button type="button" className="btn-primario iniciar-sesion" onClick={inciarSesion}> Iniciar Sesión </button>
              <br />
            </CL>
          </ContainerInput>

          <ContainerName>
            <ContainerTitle>
              <img src={udgblanco} alt="udg logo" style={{ width: '33%', margin: '0 auto' }} />
              <Title color="white" size="250%">Reportes Área de la Salud</Title>
              <img src={caduceo} alt="cauduceo logo" style={{ width: '10%', margin: '0 auto' }} />
            </ContainerTitle>
          </ContainerName>
        </ContainerLogin>
      </DIV>
    </div>
  );
}

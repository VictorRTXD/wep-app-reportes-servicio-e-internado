/* eslint-disable react/jsx-curly-brace-presence */
import React, { useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import Modal, { DatosModal } from '../../../componentes/Modal';
import config from '../../../appConfig';

import './styles.css';
import '../../../global.css';

export default function Registro() {
  const nombre = useRef<HTMLInputElement>(null);
  const nombreUsuario = useRef<HTMLInputElement>(null);
  const contrasena = useRef<HTMLInputElement>(null);
  const repetirContrasena = useRef<HTMLInputElement>(null);
  const preguntaUno = useRef<HTMLInputElement>(null);
  const preguntaDos = useRef<HTMLInputElement>(null);
  const [carrera, setCarrera] = useState('');
  const [codigo, setCodigo] = useState(0);

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });

  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const { actualizar } = useParams<{ actualizar: string }>();

  let metodo = 'POST';
  let ok: boolean;

  if (actualizar) {
    metodo = 'PUT';
  }

  function registrar() {
    if (
      nombre.current?.value === ''
      || carrera === ''
      || codigo === 0
      || nombreUsuario.current?.value === ''
      || contrasena.current?.value === ''
      || repetirContrasena.current?.value === ''
      || preguntaUno.current?.value === ''
      || preguntaDos.current?.value === ''
    ) {
      setDatosModal({
        tipo: 'error',
        texto: 'Algunos datos estan vacíos',
        visibilidad: true,
        callback: () => {},
      });
    } else if (contrasena.current?.value !== repetirContrasena.current?.value) {
      setDatosModal({
        tipo: 'error',
        texto: 'Las contraseñas no coinciden',
        visibilidad: true,
        callback: () => {},
      });
    } else {
      const registro = {
        nombre: nombre.current?.value,
        carrera,
        codigo,
        rol: 'prestador', // Hardcode
        nombreUsuario: nombreUsuario.current?.value,
        contrasena: contrasena.current?.value,
        preguntaSeguridadUno: preguntaUno.current?.value,
        preguntaSeguridadDos: preguntaDos.current?.value,
      };

      fetch(`${config.apiBaseUrl}/public/usuarios`, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registro),
      })
        .then((response) => {
          ok = response.ok;
          return response.json();
        })
        .then((data) => {
          if (ok) {
            setRedireccionamiento('/usuario/iniciar-sesion');

            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Registro Exitoso',
              visibilidad: true,
              callback: () => {},
            });
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

  function manejarCambiosCodigo(e: any) {
    setCodigo(e.target.value.replace(/[a-zA-Z ^\s.@$%^&()\-/´+{},:¨_|°"#?¡¿!='Ññ]/g, ''));
  }

  function manejarCambiosCarrera(e: any) {
    setCarrera(e.target.value);
  }

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => {},
    });

    if (redireccionamiento) {
      setRetornar(true);
    }
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

      <h2 className="texto-encabezado">{metodo === 'POST' ? 'Registro' : 'Actualizar Informacion de Prestador'}</h2>

      <div className="ctn-con-padding">

        {
          metodo === 'PUT'
            ? (
              <div>
                <span>Se reemplazará la Informacion de Prestador</span>
                <br />
                <br />

              </div>
            )
            : <span />
        }

        <label id="nombreUsuario" htmlFor="nombreUsuario">
          {metodo === 'POST' ? 'Nombre de Usuario (Puede ser una combinación de letras y números)'
            : 'Introduce tu nombre de usuario (No puede ser actualizado):'}
          <input type="text" name="nombreUsuario" ref={nombreUsuario} />
        </label>
        <br />

        <label id="nombre" htmlFor="nombre">
          Nombre Completo:
          <input type="text" name="nombre" ref={nombre} />
        </label>
        <br />

        <label id="codigo" htmlFor="codigo">
          Codigo:
          <input type="text" min="0" name="codigo" value={codigo} onChange={(e) => manejarCambiosCodigo(e)} />
        </label>
        <br />

        <label id="contrasena" htmlFor="contrasena">
          Contraseña:
          <input type="text" name="contrasena" ref={contrasena} />
        </label>
        <br />

        <label id="repetirContrasena" htmlFor="repetirContrasena">
          Repetir Contraseña:
          <input type="text" name="repetirContrasena" ref={repetirContrasena} />
        </label>
        <br />

        <label id="carrera" htmlFor="carrera">
          {'Carrera: '}
          <br />

          <select
            id="input-carrera"
            name="carrera"
            onChange={(e) => manejarCambiosCarrera(e)}
          >
            <option>{''}</option>
            <option>Licenciatura en Enfermería</option>
            <option>Licenciatura en Psicología</option>
            <option>Licenciatura en Nutrición</option>
            <option>Medicina en Odontología</option>
            <option>Medicina</option>
          </select>
          {/* <input type="text" name="carrera" ref={carrera} /> */}
        </label>
        <br />
        <br />

        <h2 id="texto-preguntas-seguridad">Preguntas de Seguridad</h2>
        <br />
        <span>
          { metodo === 'POST' ? 'En caso que olvides tu contrasena' : 'Introduce tus respuestas para verificar' }
        </span>
        <br />
        <br />

        <label id="preguntaUno" htmlFor="preguntaUno">
          ¿Cual es el nombre de tu primer mascota?
          <input type="text" name="preguntaUno" ref={preguntaUno} />
        </label>
        <br />

        <label id="preguntaDos" htmlFor="preguntaDos">
          ¿Quien fue tu primer beso?
          <input type="text" name="preguntaDos" ref={preguntaDos} />
        </label>
        <br />

        <button type="button" className="btn-primario" onClick={registrar}>
          { metodo === 'POST' ? 'Registrarse' : 'Actualizar'}
        </button>
        <br />
      </div>
    </>
  );
}

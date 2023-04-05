/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import config from '../../appConfig';
import Navegacion from '../../componentes/BarraNavegacion';
import Modal, { DatosModal } from '../../componentes/Modal';
import '../../global.css';
import caduceo from '../../recursos/caduceo.png';

export default function PaginaPrincipal() {
  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState<boolean>(false);
  const [redireccionamiento, setRedireccionamiento] = useState<string | null>(null);

  let token: string | null = '';
  let ok: boolean;
  let status: number;

  try {
    token = sessionStorage.getItem('token');
  } catch {
    // eslint-disable-next-line no-console
    console.log('No se pudo obtener el token');
  }

  // Para evitar hacer varios request y porque las visetas tiene mucha relación entre ellas se traen
  // todos los datos al inicio y se almacenan en la sesion
  useEffect(() => {
    if (token) {
      // Obtener servicio
      fetch(`${config.apiBaseUrl}/public/servicio`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          ok = response.ok;
          status = response.status;
          return response.json();
        })
        .then((data) => {
          // eslint-disable-next-line no-console
          console.log(data);

          if (ok) {
            if (data.id
              && data.entidadReceptora
              && data.receptor
              && data.programa
              && data.horarioHoraInicio
              && data.horarioHoraFin
              && data.objetivosDelPrograma
              && data.entidadReceptora !== ''
              && data.receptor !== ''
              && data.programa !== ''
              && data.horarioHoraInicio !== ''
              && data.horarioHoraFin !== ''
              && data.objetivosDelPrograma !== ''
            ) {
              const servicioDatosGenerales: any = {
                id: data.id,
                idUsuario: data.idUsuario,
                entidadReceptora: data.entidadReceptora,
                receptor: data.receptor,
                programa: data.programa,
                objetivosDelPrograma: data.objetivosDelPrograma,
                fechaInicio: data.fechaInicio || '',
                fechaFin: data.fechaFin || '',
                totalDeHoras: data.totalDeHoras || 0,
                horarioHoraInicio: data.horarioHoraInicio || '',
                horarioHoraFin: data.horarioHoraFin || '',
              };

              sessionStorage.setItem('servicioDatosGenerales', JSON.stringify(servicioDatosGenerales));
            } else {
              // Redirigir
              setRedireccionamiento('/servicio/formulario');

              setDatosModal({
                tipo: null,
                texto: 'Parece que no has ingresado algunos datos acerca del tu servicio o internado, ¡Comencemos!',
                visibilidad: true,
                callback: () => {},
              });
              sessionStorage.setItem('servicioDatosGenerales', JSON.stringify({}));
            }

            sessionStorage.setItem('reportesParciales', JSON.stringify(data.reportesParciales));
            sessionStorage.setItem('reporteFinalDos', JSON.stringify(data.reporteFinalDos));
            sessionStorage.setItem('actividadesDeUsuario', JSON.stringify(data.actividadesDeUsuario));
          } else if (status === 404) {
            setRedireccionamiento('/servicio/formulario');

            setDatosModal({
              tipo: null,
              texto: 'Parece que no has ingresado algunos datos acerca del tu servicio o internado, ¡Comencemos!',
              visibilidad: true,
              callback: () => {},
            });
          } else {
            setDatosModal({
              tipo: 'error',
              texto: 'Ocurrió un error al conectar al servidor',
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
            texto: 'No se puede conectar al servidor',
            visibilidad: true,
            callback: () => {},
          });
        });

      // Obtener trimestres
      fetch(`${config.apiBaseUrl}/public/servicio/trimestres`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((dataTrimestres) => {
          // eslint-disable-next-line no-console
          console.log(dataTrimestres);

          sessionStorage.setItem('trimestres', JSON.stringify(dataTrimestres || []));

          if (Array.isArray(dataTrimestres)) {
            if (dataTrimestres.length <= 0) {
              setRedireccionamiento('/servicio/formulario');
              setDatosModal({
                tipo: 'error',
                texto: 'No se pudieron obtener las fechas de los trimestres. Quizás las fechas que ingresaste son inválidas. ',
                visibilidad: true,
                callback: () => {},
              });
            }
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('No se pudo obtener los trimestres');
        });
    } else {
      setRedireccionamiento('/usuario/iniciar-sesion');
      setRetornar(true);
    }
  }, []);

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
    <div id="container">
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        callback={cerrarModal}
      />
      <Navegacion select={0} />
      <div
        id="crear"
      >
        <div style={{
          background: `url(${caduceo}) no-repeat center center fixed`,
          backgroundSize: '50%',
          filter: 'drop-shadow(5px 5px 5px rgba(0,0,0,0.5))',
          backgroundPosition: 'center',
          // backgroundPositionY: 150,
          // backgroundPositionX: '68%',
        }}
        />
        <div>
          <h1 id="pagina-principal-titulo" style={{ position: 'relative', marginLeft: 10 }}>¡Bienvenido!</h1>
        </div>
        <div>
          <p id="pagina-principal-texto" style={{ fontWeight: 500, alignSelf: 'center' }}>Para ver o completar un reporte, selecciónalo desde la barra izquierda.</p>
        </div>
      </div>
    </div>
  );
}

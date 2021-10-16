/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import config from '../../appConfig';
import BarraNavegacion from '../../componentes/BarraNavegacion';
import Modal, { DatosModal } from '../../componentes/Modal';
import '../../global.css';

export default function PaginaPrincipal() {
  const idUsuario = 1; // Hardcode
  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState<boolean>(false);
  const [redireccionamiento, setRedireccionamiento] = useState<string | null>(null);

  // Para evitar hacer varios request y porque las visetas tiene mucha relación entre ellas se traen
  // todos los datos al inicio y se almacenan en la sesion
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/public/servicio/${idUsuario}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return null;
      })
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log(data);

        if (data) {
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
            setDatosModal({
              tipo: 'error',
              texto: 'Parece que no has ingresado algunos datos acerca del tu servicio o internado, ¡Comencemos!',
              visibilidad: true,
              callback: () => {},
            });
            setRedireccionamiento('/servicio/formulario');
            sessionStorage.setItem('servicioDatosGenerales', JSON.stringify({}));
          }

          if (data.reportesParciales && Object.entries(data.reportesParciales).length > 0) {
            sessionStorage.setItem('reportesParciales', JSON.stringify(data.reportesParciales));
          } else {
            sessionStorage.setItem('reportesParciales', JSON.stringify([]));
          }

          if (data.reporteFinalDos && Object.entries(data.reporteFinalDos).length > 0) {
            sessionStorage.setItem('reporteFinalDos', JSON.stringify(data.reporteFinalDos));
          } else {
            sessionStorage.setItem('reporteFinalDos', JSON.stringify({}));
          }

          if (data.actividadesDeUsuario && Object.entries(data.actividadesDeUsuario).length > 0) {
            sessionStorage.setItem('actividadesDeUsuario', JSON.stringify(data.actividadesDeUsuario));
          } else {
            sessionStorage.setItem('actividadesDeUsuario', JSON.stringify([]));
          }
        } else {
          setDatosModal({
            tipo: 'error',
            texto: 'Ocurrio un error al conectar al servidor',
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
  }, [idUsuario, config.apiBaseUrl]);

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => {},
    });

    setRetornar(retornar);
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

      <BarraNavegacion />

      <h1 id="pagina-principal-titulo">¡Bienvenido!</h1>

    </>
  );
}

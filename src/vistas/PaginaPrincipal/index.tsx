/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import config from '../../appConfig';
import BarraNavegacion from '../../componentes/BarraNavegacion';
import '../../global.css';
import ServicioEInternado from '../../recursos/interfaces/ServicioEInternado';

export default function PaginaPrincipal() {
  const [status, setStatus] = useState<number>(0);
  const idUsuario = 1;

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/public/servicio/${idUsuario}`)
      .then((response) => {
        setStatus(response.status);
        return response.json();
      })
      .then((data) => {
        const servicioDatosGenerales: ServicioEInternado = {
          id: data.id || null,
          idUsuario: data.idUsuario || null,
          entidadReceptora: data.entidadReceptora || null,
          receptor: data.receptor || null,
          programa: data.programa || null,
          objetivosDelPrograma: data.objetivosDelPrograma || null,
          fechaInicio: data.fechaInicio || null,
          fechaFin: data.fechaFin || null,
          totalDeHoras: data.totalDeHoras || null,
          horarioHoraInicio: data.horarioHoraInicio || null,
          horarioHoraFin: data.horarioHoraFin || null,
        };

        sessionStorage.setItem('servicioDatosGenerales', JSON.stringify(servicioDatosGenerales));
        sessionStorage.setItem('reportesParciales', JSON.stringify(data.reportesParciales || null));
        sessionStorage.setItem('reporteFinalDos', JSON.stringify(data.reporteFinalDos || null));
        sessionStorage.setItem('actividadesDeUsuario', JSON.stringify(data.actividadesDeUsuario || null));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, [idUsuario, config.apiBaseUrl]);

  return (
    (status === 404)
      ? <Redirect to="/servicio/crear" />
      : <BarraNavegacion />
  );
}

/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router';
import appConfig from '../../../appConfig';

import Navegacion from '../../../componentes/BarraNavegacion';
import '../../../global.css';
import AtencionesRealizadas from '../../../recursos/interfaces/AtencionesRealizadas';
import './styles.css';

interface ActividadesReporteParcial {
  id: number,
  descripcion: string,
  cantidad: number
}

export default function ReportesParciales() {
  const { numero } = useParams<{ numero: string }>();
  const numeroReporte = parseInt(numero, 10);

  const actividadesReporteAux: ActividadesReporteParcial[] = [];
  const antencionesRealizadasAux: any[] = [{
    descripcion: 'Prenatales',
    cantidad: 0,
  },
  {
    descripcion: 'Niños 0 a 12 años',
    cantidad: 0,
  },
  {
    descripcion: 'Niñas 0 a 12 años',
    cantidad: 0,
  },
  {
    descripcion: 'Onvres',
    cantidad: 0,
  },
  {
    descripcion: 'Mujeres',
    cantidad: 0,
  },
  {
    descripcion: 'Geríatrico hombre',
    cantidad: 0,
  },
  {
    descripcion: 'Geríatrico Mujer',
    cantidad: 0,
  }];

  let redirect;
  let metodo = 'POST';
  let incializadorTotalActividades = 0;
  let incializadorTotalAtenciones = 0;

  const servicio = {
    reportesParciales: JSON.parse(sessionStorage.getItem('reportesParciales') || 'null'),
    actividadesDeUsuario: JSON.parse(sessionStorage.getItem('actividadesDeUsuario') || 'null'),
  };

  if (servicio.reportesParciales.length >= numeroReporte) {
    if (servicio.reportesParciales[numeroReporte - 1]) {
      if (servicio.reportesParciales[numeroReporte] > 1) {
        if (!servicio.reportesParciales[numeroReporte - 2]) {
          console.log('No has completado el reporte anterior'); // Cambiar x modal
          redirect = <Redirect to={`/reportes-parciales/${numeroReporte - 2}/formulario`} />;
        }
      }

      metodo = 'PUT';

      // Mapear actividades
      for (let i = 0; i < servicio.reportesParciales[numeroReporte - 1].actividadesRealizadas.length; i += 1) {
        let indexActividadUsuario: number = -1;

        // Buscar la actividad de usuario correspondiento
        for (let j = 0; j < servicio.actividadesDeUsuario.length; j += 1) {
          if (servicio.actividadesDeUsuario[j].id === servicio.reportesParciales[numeroReporte - 1].actividadesRealizadas[i].idActividad) {
            indexActividadUsuario = j;
          }
        }

        incializadorTotalActividades += servicio.reportesParciales[numeroReporte - 1].actividadesRealizadas[i].cantidad;

        actividadesReporteAux.push({
          id: servicio.actividadesDeUsuario[indexActividadUsuario].id,
          descripcion: servicio.actividadesDeUsuario[indexActividadUsuario].descripcion,
          cantidad: servicio.reportesParciales[numeroReporte - 1].actividadesRealizadas[i].cantidad,
        });
      }

      // Mapear atenciones
      for (let i = 0; i < servicio.reportesParciales[numeroReporte - 1].atencionesRealizadas.length; i += 1) {
        antencionesRealizadasAux[i].cantidad = servicio.reportesParciales[numeroReporte - 1].atencionesRealizadas[i].cantidad;
        incializadorTotalAtenciones += antencionesRealizadasAux[i].cantidad;
      }
    }
  }

  const [actividadesUsuario, setActividadesUsuario] = useState<ActividadesReporteParcial[]>(actividadesReporteAux);
  const [atencionesRealizadas, setAtencionesRealizadas] = useState<AtencionesRealizadas[]>(antencionesRealizadasAux);

  const [totalActividades, setTotalActividades] = useState(incializadorTotalActividades);
  const [totalAtencioens, setTotalAtenciones] = useState(incializadorTotalAtenciones);

  function crearOActualizar() {
    const reporte = {
      idUsuario: 1,
      idServicio: 1,
      numeroReporte,
      actividadesUsuario,
      atencionesRealizadas,
    };

    fetch(`${appConfig.apiBaseUrl}/public/reportes/${numeroReporte}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reporte),
    })
      .then((response) => response.json())
      .then((data) => {
        servicio.reportesParciales[numeroReporte - 1] = data;
        sessionStorage.setItem('reportesParciales', JSON.stringify(servicio.reportesParciales || null));
        // Obtener actividades de usuario
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  function calcularActividades() {
    let total = 0;

    for (let i = 0; i < actividadesUsuario.length; i += 1) {
      total += Number(actividadesUsuario[i].cantidad);
    }

    setTotalActividades(total);
  }

  function calcularAtenciones() {
    let total = 0;

    for (let i = 0; i < atencionesRealizadas.length; i += 1) {
      total += Number(atencionesRealizadas[i].cantidad);
    }

    setTotalAtenciones(total);
  }

  function agregarActividad() {
    setActividadesUsuario([...actividadesUsuario, { id: 0, descripcion: '', cantidad: 0 }]);
  }

  function eliminarActividad() {
    try {
      const nuevasActividades = [...actividadesUsuario];
      nuevasActividades.splice(actividadesUsuario.length - 1, 1);
      setActividadesUsuario(nuevasActividades);
      calcularActividades();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  function manejarCambiosActividades(e: any, i: number) {
    if (e.target.type === 'number') {
      const regex = /^[0-9\b]+$/;
      if (e.target.value.match(regex)) {
        const nuevasActividades = [...actividadesUsuario];
        nuevasActividades[i].cantidad = e.target.value;
        setActividadesUsuario(nuevasActividades);
        calcularActividades();
      }
    } else {
      const nuevasActividades: any[] = [...actividadesUsuario];
      nuevasActividades[i][e.target.name] = e.target.value;
      setActividadesUsuario(nuevasActividades);
    }
  }

  function manejarCambiosAtenciones(e: any, i: number) {
    const regex = /^[0-9\b]+$/;
    if (e.target.value.match(regex)) {
      const nuevasAtenciones = [...atencionesRealizadas];
      nuevasAtenciones[i].cantidad = e.target.value;
      setAtencionesRealizadas(nuevasAtenciones);
      calcularAtenciones();
    }
  }

  if (redirect) {
    return redirect;
  }

  return (
    <div>
      <Navegacion />

      <form>
        <table>
          <thead>
            <tr>
              <th id="columna-descripcion">Actividades Realizadas</th>
              <th id="columna-cantidad">Cantidad</th>
            </tr>
          </thead>

          <tbody>
            {
              actividadesUsuario.map((actividad: any, i: number) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      name="descripcion"
                      key="dummy"
                      value={actividad.descripcion}
                      onChange={(e) => manejarCambiosActividades(e, i)}
                      className="input"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      name="cantidad"
                      key="dummy"
                      min="0"
                      value={actividad.cantidad}
                      onChange={(e) => manejarCambiosActividades(e, i)}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>

          <tfoot>
            <tr>
              <td className="total"><span className="total">Total</span></td>
              <td className="total">{totalActividades}</td>
            </tr>
          </tfoot>
        </table>
        <br />

        <div id="ctn-btn-cantidad">
          <button type="button" className="btn-redondo btn-cantidad" onClick={agregarActividad}> + </button>
          <button type="button" className="btn-redondo btn-cantidad" onClick={eliminarActividad}> - </button>
        </div>
        <br />
        <br />

        <table id="tabla-atenciones">
          <thead>
            <tr>
              <th id="columna-descripcion">Atenciones Realizadas</th>
              <th id="columna-cantidad">Cantidad</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Prenatales</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[0].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 0)}
                />
              </td>
            </tr>

            <tr>
              <td>Niños</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[1].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 1)}
                />
              </td>
            </tr>

            <tr>
              <td>Niñas</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[2].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 2)}
                />
              </td>
            </tr>

            <tr>
              <td>Hombres</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[3].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 3)}
                />
              </td>
            </tr>

            <tr>
              <td>Mujeres</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[4].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 4)}
                />
              </td>
            </tr>

            <tr>
              <td>Geriátrico Hombre</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[5].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 5)}
                />
              </td>
            </tr>

            <tr>
              <td>Geriátrico Mujer</td>
              <td>
                <input
                  type="number"
                  name="cantidad"
                  key="dummy"
                  min="0"
                  value={atencionesRealizadas[6].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 6)}
                />
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td className="total"><span>Total</span></td>
              <td className="total">{totalAtencioens}</td>
            </tr>
          </tfoot>
        </table>
        <br />
        <br />

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizar}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import appConfig from '../../../appConfig';

import Navegacion from '../../../componentes/BarraNavegacion';
import Modal, { DatosModal } from '../../../componentes/Modal';
import '../../../global.css';
import './styles.css';

interface ActividadesReporteParcial {
  id: number,
  descripcion: string,
  cantidad: number,
  type: 'input' | 'select'
}

interface AtencionesRealizadas {
  descripcion: string
  cantidad: number
}

interface OpcionesActividades {
  id: number
  descripcion: string
}

export default function ReportesParciales() {
  // Obtener datos
  const reportesParciales = JSON.parse(sessionStorage.getItem('reportesParciales')!);
  const actividadesDeUsuario = JSON.parse(sessionStorage.getItem('actividadesDeUsuario')!);

  const { numero } = useParams<{ numero: string }>();

  const numeroReporte = parseInt(numero, 10);

  const opcionesActividades: OpcionesActividades [] = [{ id: -1, descripcion: '' }, { id: 0, descripcion: '+ NUEVA ACTIVIDAD' }];

  const actividadesReporteAux: ActividadesReporteParcial[] = [];

  const antencionesRealizadasAux: AtencionesRealizadas[] = [{
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
    descripcion: 'Hombres',
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

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });

  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  let metodo = 'POST';

  let incializadorTotalActividades = 0;
  let incializadorTotalAtenciones = 0;

  useEffect(() => {
    if (numeroReporte === 1 || reportesParciales.length >= numeroReporte) {
      if (reportesParciales.length >= numeroReporte) {
        metodo = 'PUT';
      }

      // Mapear actividades
      for (let i = 0; i < reportesParciales[numeroReporte - 1].actividadesRealizadas.length; i += 1) {
        let indexActividadUsuario: number = -1;

        // Buscar la actividad de usuario correspondiento
        for (let j = 0; j < actividadesDeUsuario.length; j += 1) {
          if (actividadesDeUsuario[j].id === reportesParciales[numeroReporte - 1].actividadesRealizadas[i].idActividad) {
            indexActividadUsuario = j;
          }
        }

        incializadorTotalActividades += reportesParciales[numeroReporte - 1].actividadesRealizadas[i].cantidad;

        actividadesReporteAux.push({
          id: actividadesDeUsuario[indexActividadUsuario].id,
          descripcion: actividadesDeUsuario[indexActividadUsuario].descripcion,
          cantidad: reportesParciales[numeroReporte - 1].actividadesRealizadas[i].cantidad,
          type: 'select',
        });
      }

      // Mapear atenciones
      for (let i = 0; i < reportesParciales[numeroReporte - 1].atencionesRealizadas.length; i += 1) {
        antencionesRealizadasAux[i].cantidad = reportesParciales[numeroReporte - 1].atencionesRealizadas[i].cantidad;
        incializadorTotalAtenciones += antencionesRealizadasAux[i].cantidad;
      }
    } else if (!reportesParciales[numeroReporte - 2]) { // -2 xq es un arreglo y xq es el anterior
      setDatosModal({
        tipo: 'error',
        texto: 'No has completado el reporte anterior',
        visibilidad: true,
        callback: () => {},
      });
      setRedireccionamiento(`/reportes-parciales/${numeroReporte - 2}/formulario`);
    }

    for (let i = 0; i < actividadesDeUsuario.length; i += 1) {
      if (actividadesDeUsuario[i].descripcion) {
        opcionesActividades.push({
          id: actividadesDeUsuario[i].id,
          descripcion: actividadesDeUsuario[i].descripcion,
        });
      }
    }
  }, ['Esto solo se ejecuta una vez']);

  const [actividadesUsuario, setActividadesUsuario] = useState<ActividadesReporteParcial[]>(actividadesReporteAux);
  const [atencionesRealizadas, setAtencionesRealizadas] = useState<AtencionesRealizadas[]>(antencionesRealizadasAux);
  const [horasRealizadas, setHorasRealizadas] = useState<number>(0);

  const [totalActividades, setTotalActividades] = useState(incializadorTotalActividades);
  const [totalAtencioens, setTotalAtenciones] = useState(incializadorTotalAtenciones);

  function crearOActualizar() {
    // Validar Campos
    let faltanDatos = !(actividadesUsuario.length > 0);

    if (horasRealizadas <= 0) {
      faltanDatos = true;
    }

    actividadesUsuario.forEach((actividad: ActividadesReporteParcial) => {
      if (actividad.descripcion === '' || actividad.cantidad <= 0) {
        faltanDatos = true;
      }
    });

    if (faltanDatos) {
      setDatosModal({
        tipo: 'error',
        texto: 'Uno o más de los datos enviados no son válidos',
        visibilidad: true,
        callback: () => {},
      });
    } else {
      // Si todos los campos estan bien, mandar solicitud
      const reporte = {
        idUsuario: 1, // Hardcode
        idServicio: 1, // Hardcode
        numeroReporte,
        horasRealizadas,
        actividades: actividadesUsuario,
        realizadas: atencionesRealizadas,
      };

      let url;
      if (metodo === 'PUT') {
        url = `${appConfig.apiBaseUrl}/public/reporte-parcial/${numeroReporte}`;
      } else {
        url = `${appConfig.apiBaseUrl}/public/reporte-parcial`;
      }

      fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporte),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          return null;
        })
        .then((data) => {
          if (data) {
            reportesParciales[numeroReporte - 1] = data;
            sessionStorage.setItem('reportesParciales', JSON.stringify(reportesParciales || null));

            setDatosModal({
              tipo: 'confirmacion',
              texto: 'Guardado',
              visibilidad: true,
              callback: () => {},
            });

            setRedireccionamiento(`/reportes-parciales/${numeroReporte}`);
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
            texto: 'Ocurrió un error',
            visibilidad: true,
            callback: () => {},
          });
        });
    }

    faltanDatos = false;
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
    setActividadesUsuario([...actividadesUsuario, {
      id: 0,
      descripcion: '',
      cantidad: 0,
      type: 'select',
    }]);
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
    // Si es númerico, o sea, el campo de cantidad
    if (e.target.type === 'number') {
      const regex = /^[0-9\b]+$/;
      if (e.target.value.match(regex)) {
        const nuevasActividades = [...actividadesUsuario];
        nuevasActividades[i].cantidad = e.target.value;
        setActividadesUsuario(nuevasActividades);
        calcularActividades();
      }
    // Si ex texto
    } else {
      const nuevasActividades: any[] = [...actividadesUsuario];
      // Si el input es de tipo select
      if (nuevasActividades[i].type === 'select') {
        const valor = JSON.parse(e.target.value);
        // Si va ser una nueva actividad
        if (valor.descripcion === '+ NUEVA ACTIVIDAD') {
          nuevasActividades[i].type = 'input';
        // Si ya existe
        } else {
          nuevasActividades[i].id = valor.id;
          nuevasActividades[i].descripcion = valor.descripcion;
        }
      // Si es entrada teclado
      } else {
        nuevasActividades[i][e.target.name] = e.target.value;
      }

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

  function manejarCambiosHorasRelizadas(e: any) {
    const regex = /^[0-9\b]+$/;
    if (e.target.value.match(regex)) {
      setHorasRealizadas(e.target.value);
    }
  }

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => {},
    });
    setRetornar(true);
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
                    {
                      actividad.type === 'input'
                        ? (
                          <input
                            type="text"
                            name="descripcion"
                            key={i}
                            value={actividad.descripcion}
                            onChange={(e) => manejarCambiosActividades(e, i)}
                            className="input"
                          />
                        )
                        : (
                          <select
                            name="descripcion"
                            key={i}
                            onChange={(e) => manejarCambiosActividades(e, i)}
                            value={`{"id": ${actividad.id}, "descripcion": "${actividad.descripcion}"}`}
                          >
                            {opcionesActividades.map((opcion: OpcionesActividades) => <option key={opcion.id} value={`{"id": ${opcion.id}, "descripcion": "${opcion.descripcion}"}`}>{opcion.descripcion}</option>)}
                          </select>
                        )
                    }
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

        <label id="labelHorasRealizadas" htmlFor="horasRealizadas" className="input">
          Horas Realizadas:
          <input
            type="number"
            name="horasRealizadas"
            min="0"
            value={horasRealizadas}
            onChange={(e) => manejarCambiosHorasRelizadas(e)}
            id="inputHorasRealizadas"
          />
        </label>
        <br />
        <br />

        <button type="button" id="btn-guardar" className="btn-primario" onClick={crearOActualizar}> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

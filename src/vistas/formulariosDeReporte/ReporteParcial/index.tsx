/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
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
  const trimestres = JSON.parse(sessionStorage.getItem('trimestres')!);

  const { numero } = useParams<{ numero: string }>();

  const numeroReporte = parseInt(numero, 10);

  const opcionesActividades: OpcionesActividades [] = [{ id: -1, descripcion: '' }, { id: 0, descripcion: '+ NUEVA ACTIVIDAD' }];

  const actividadesReporteAux: ActividadesReporteParcial[] = [];

  const antencionesRealizadasAux: AtencionesRealizadas[] = [
    {
      descripcion: 'Prenatales',
      cantidad: 0,
    },
    {
      descripcion: 'Niños 0 a 12 años',
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
      descripcion: 'Geríatrico',
      cantidad: 0,
    },
  ];

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });

  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const token = sessionStorage.getItem('token');

  let ok: boolean;
  let metodo = 'POST';

  let incializadorTotalActividades = 0;
  let incializadorTotalAtenciones = 0;
  let inicializadorHorasRealizdas = 0;

  let aunNoSePuedeRealizarReporte: boolean = false;

  if (Array.isArray(trimestres) || !trimestres) {
    if (trimestres.length <= 0 || !trimestres) {
      if (datosModal.visibilidad === false) {
        setRedireccionamiento('/servicio/formulario');

        setDatosModal({
          tipo: 'error',
          texto: 'No se puedieron obtener las fechas de los trimestres. Quizás las fechas que ingresaste son inválidas. Vuelve a ingresar las fechas',
          visibilidad: true,
          callback: () => {},
        });
      }
    }
  } else {
    switch (numeroReporte) {
      case 1:
        if (new Date().getTime() < new Date(trimestres[1].fechaInicio).getTime()) {
          if (redireccionamiento === '') {
            setRedireccionamiento('/');
          }
          aunNoSePuedeRealizarReporte = true;
        }
        break;
      case 2:
        if (new Date().getTime() < new Date(trimestres[2].fechaInicio).getTime()) {
          if (redireccionamiento === '') {
            setRedireccionamiento('/reportes-parciales/1');
          }
          aunNoSePuedeRealizarReporte = true;
        }
        break;
      case 3:
        if (new Date().getTime() < new Date(trimestres[3].fechaInicio).getTime()) {
          if (redireccionamiento === '') {
            setRedireccionamiento('/reportes-parciales/2');
          }
          aunNoSePuedeRealizarReporte = true;
        }
        break;
      case 4:
        if (new Date().getTime() < new Date(trimestres[3].fechaFin).getTime()) {
          if (redireccionamiento === '') {
            setRedireccionamiento('/reportes-parciales/3');
          }
          aunNoSePuedeRealizarReporte = true;
        }
        break;
      default:
        break;
    }
  }

  if (aunNoSePuedeRealizarReporte && redireccionamiento === '') {
    setDatosModal({
      tipo: 'error',
      texto: 'Aun no puedes realizar este reporte',
      visibilidad: true,
      callback: () => {},
    });
  }

  if (reportesParciales.length >= numeroReporte) {
    metodo = 'PUT';

    // Mapear actividades
    for (let i = 0; i < reportesParciales[numeroReporte - 1].actividadesRealizadas.length; i += 1) {
      let indexActividadUsuario: number = -1;

      // Buscar la actividad de usuario correspondiento
      for (let j = 0; j < actividadesDeUsuario.length; j += 1) {
        if (actividadesDeUsuario[j].id === reportesParciales[numeroReporte - 1].actividadesRealizadas[i].idActividad) {
          indexActividadUsuario = j;
        }
      }

      incializadorTotalActividades += Number(reportesParciales[numeroReporte - 1].actividadesRealizadas[i].cantidad);

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

    inicializadorHorasRealizdas = reportesParciales[numeroReporte - 1].horasRealizadas;
  } else if (numeroReporte > 1) { // -2 xq es un arreglo y xq es el anterior
    if (!reportesParciales[numeroReporte - 2]) {
      if (redireccionamiento === '') {
        if (numeroReporte !== 1) {
          setRedireccionamiento(`/reportes-parciales/${numeroReporte - 2}`);

          setDatosModal({
            tipo: 'error',
            texto: 'No has completado el reporte anterior',
            visibilidad: true,
            callback: () => {},
          });
        } else {
          setRedireccionamiento(`/reportes-parciales/${numeroReporte - 2}`);

          setDatosModal({
            tipo: 'error',
            texto: 'No has completado el reporte anterior',
            visibilidad: true,
            callback: () => {},
          });
        }
      }
    }
  }

  // Mapear actividades para select
  for (let i = 0; i < actividadesDeUsuario.length; i += 1) {
    if (actividadesDeUsuario[i].descripcion) {
      opcionesActividades.push({
        id: actividadesDeUsuario[i].id,
        descripcion: actividadesDeUsuario[i].descripcion,
      });
    }
  }

  const [actividadesUsuario, setActividadesUsuario] = useState<ActividadesReporteParcial[]>(actividadesReporteAux);
  const [atencionesRealizadas, setAtencionesRealizadas] = useState<AtencionesRealizadas[]>(antencionesRealizadasAux);
  const [horasRealizadas, setHorasRealizadas] = useState<number>(inicializadorHorasRealizdas);

  const [totalActividades, setTotalActividades] = useState(incializadorTotalActividades);
  const [totalAtencioens, setTotalAtenciones] = useState(incializadorTotalAtenciones);

  function crearOActualizar() {
    // Validar Campos
    let faltanDatos = !(actividadesUsuario.length >= 0);

    if (horasRealizadas < 0) {
      faltanDatos = true;
    }

    let actividadRepetida = false;

    for (let i = 0; i < actividadesUsuario.length; i += 1) {
      if (actividadesUsuario[i].descripcion === '' || actividadesUsuario[i].cantidad < 0) {
        faltanDatos = true;
      }

      for (let j = i + 1; j < actividadesUsuario.length; j += 1) {
        if (actividadesUsuario[i].id === actividadesUsuario[j].id && actividadesUsuario[i].id !== 0) {
          actividadRepetida = true;
        }
      }
    }

    for (let i = 0; i < atencionesRealizadas.length; i += 1) {
      atencionesRealizadas[i].cantidad = Number(atencionesRealizadas[i].cantidad);
    }

    if (faltanDatos) {
      setDatosModal({
        tipo: 'error',
        texto: 'Uno o más de los datos enviados no son válidos',
        visibilidad: true,
        callback: () => {},
      });
    } else if (actividadRepetida) {
      setDatosModal({
        tipo: 'error',
        texto: 'Una actividad esta repetida, esto puede generar erroes de calculo',
        visibilidad: true,
        callback: () => {},
      });
    } else {
      // Si todos los campos estan bien, mandar solicitud
      const reporte = {
        horasRealizadas,
        actividadesUsuario,
        atencionesRealizadas,
      };

      fetch(`${appConfig.apiBaseUrl}/public/reporte-parcial/${numeroReporte}`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporte),
      })
        .then((response) => {
          ok = response.ok;
          return response.json();
        })
        .then((data) => {
          if (ok) {
            reportesParciales[numeroReporte - 1] = data;
            sessionStorage.setItem('reportesParciales', JSON.stringify(reportesParciales || null));

            fetch(`${appConfig.apiBaseUrl}/public/usuarios/actividades`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => response.json())
              .then((dataActividadesDeUsuario) => {
                sessionStorage.setItem('actividadesDeUsuario', JSON.stringify(dataActividadesDeUsuario || null));

                setRedireccionamiento(`/reportes-parciales/${numeroReporte}`);

                setDatosModal({
                  tipo: 'confirmacion',
                  texto: 'Guardado',
                  visibilidad: true,
                  callback: () => {},
                });
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
              });
          } else if (data.code) {
            if (data.code === 'SESION_EXPIRADA') {
              setDatosModal({
                tipo: 'error',
                texto: data.code,
                visibilidad: true,
                callback: () => {},
              });
              if (redireccionamiento === '') {
                setRedireccionamiento('/usuario/iniciar-sesion');
              }
            } else {
              setDatosModal({
                tipo: 'error',
                texto: data.code,
                visibilidad: true,
                callback: () => {},
              });
            }
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

  function manejarCambiosNumericos(e: any, i: number) {
    const nuevasActividades = [...actividadesUsuario];
    nuevasActividades[i].cantidad = e.target.value.replace(/[a-zA-Z ^\s.@$%^&()\-/´+{},:¨_|°"#?¡¿!='Ññ]/g, '');
    setActividadesUsuario(nuevasActividades);
    calcularActividades();
  }

  function manejarCambiosActividades(e: any, i: number) {
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

  function manejarCambiosAtenciones(e: any, i: number) {
    const nuevasAtenciones = [...atencionesRealizadas];
    nuevasAtenciones[i].cantidad = e.target.value.replace(/[a-zA-Z ^\s.@$%^&()\-/´+{},:¨_|°"#?¡¿!='Ññ]/g, '');
    setAtencionesRealizadas(nuevasAtenciones);
    calcularAtenciones();
  }

  function manejarCambiosHorasRelizadas(e: any) {
    setHorasRealizadas(e.target.value.replace(/[a-zA-Z ^\s.@$%^&()\-/´+{},:¨_|°"#?¡¿!='Ññ]/g, ''));
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
    <div>
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        // eslint-disable-next-line react/jsx-no-bind
        callback={cerrarModal}
      />

      <Navegacion />
      <br />
      <br />

      <h2 className="texto-encabezado">{`Formulario Reporte Parcial #${numeroReporte}`}</h2>
      <br />

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
                            className="input input-formulario"
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
                      className="input-formulario"
                      min="0"
                      value={actividad.cantidad}
                      onChange={(e) => manejarCambiosNumericos(e, i)}
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
                  type="text"
                  name="prenatales"
                  key="dummy"
                  min="0"
                  className="input-formulario"
                  value={atencionesRealizadas[0].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 0)}
                />
              </td>
            </tr>

            <tr>
              <td>Niños</td>
              <td>
                <input
                  type="text"
                  name="ninios"
                  key="dummy"
                  min="0"
                  className="input-formulario"
                  value={atencionesRealizadas[1].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 1)}
                />
              </td>
            </tr>

            <tr>
              <td>Hombres</td>
              <td>
                <input
                  type="text"
                  name="hombres"
                  key="dummy"
                  min="0"
                  className="input-formulario"
                  value={atencionesRealizadas[2].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 2)}
                />
              </td>
            </tr>

            <tr>
              <td>Mujeres</td>
              <td>
                <input
                  type="text"
                  name="mujeres"
                  key="dummy"
                  min="0"
                  className="input-formulario"
                  value={atencionesRealizadas[3].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 3)}
                />
              </td>
            </tr>

            <tr>
              <td>Geriátrico</td>
              <td>
                <input
                  type="text"
                  name="geriatricomasculino"
                  key="dummy"
                  min="0"
                  className="input-formulario"
                  value={atencionesRealizadas[4].cantidad}
                  onChange={(e) => manejarCambiosAtenciones(e, 4)}
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
            type="text"
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

import React, { useState } from 'react';
import config from '../../appConfig';
import BarraNavegacion from '../../componentes/BarraNavegacion';
import '../../global.css';
import './styles.css';

// import { ReporteParcial } from '../../resources';

export default function ReportesParciales() {
  const [actividadesUsuario, setActividadesUsuario] = useState([{
    descripcion: '',
    cantidad: 0,
  }]);

  const [atencionesRealizadas, setAtencionesRealizadas] = useState([
    {
      prenatales: '',
      cantidad: 0,
    },
    {
      ninos: '',
      cantidad: 0,
    },
    {
      ninas: '',
      cantidad: 0,
    },
    {
      hombres: '',
      cantidad: 0,
    },
    {
      mujeres: '',
      cantidad: 0,
    },
    {
      ancianos: '',
      cantidad: 0,
    },
    {
      ancianas: '',
      cantidad: 0,
    },
  ]);

  const [totalActividades, setTotalActividades] = useState(0);
  const [totalAtencioens, setTotalAtenciones] = useState(0);

  // Revisar si tiene un servicio creado, si no mandar a formulario

  // function crearReporte() {}
  // function actualizarReporte() {}

  // eslint-disable-next-line no-unused-vars

  // dummy user()
  const user = {
    id: 1,
    rol: 'prestador',
  };

  // eslint-disable-next-line no-unused-vars
  function obtenerReporte(numberoReporte: number) {
    fetch(`${config.apiBaseUrl}/reportes-parciales/${user.id}/${numberoReporte}`) // Puede ser número de reporte o calcular el trimestre
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .then((data) => console.log(data));
  }

  // function generarReporteParcial() {}
  // function generarReporteFinal() {}
  // function generarReporteFinal2() {}

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
    setActividadesUsuario([...actividadesUsuario, { descripcion: '', cantidad: 0 }]);
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

  return (
    <div>
      <BarraNavegacion />

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
                <tr>
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

        <div id="cnt-btn-cantidad">
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

        <button type="button" id="btn-guardar" className="btn-primario"> Guardar </button>
        <br />
        <br />

      </form>
    </div>
  );
}

/* eslint-disable react/no-array-index-key */
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import escudo from '../../recursos/escudo.png';
import firma from '../../recursos/firma.png';

import '../../global.css';
import './styles.css';

export default function DocumentoReporteParcial() {
  const testString: string = 'test';
  const actividadesPrueba: any[] = [
    {
      descripcion: 'Apoyo en Dirección',
      cantidad: [12, 14, 0, 5],
    },
    {
      descripcion: 'Elaboración de Capitales constitutivos',
      cantidad: [36, 0, 10, 17],
    },
    {
      descripcion: 'Apoyo en jefatura de consulta',
      cantidad: [24, 27, 48, 2],
    },
  ];

  const atencionesPrueba: any[] = [
    {
      descripcion: 'Prenatales',
      cantidad: [12, 14, 0, 5],
    },
    {
      descripcion: 'Niños 0 a 12 años',
      cantidad: [36, 0, 10, 17],
    },
    {
      descripcion: 'Niñas 0 a 12 años',
      cantidad: [36, 0, 10, 17],
    },
    {
      descripcion: 'Onvres',
      cantidad: [24, 27, 48, 2],
    },
    {
      descripcion: 'Mujeres',
      cantidad: [24, 27, 48, 2],
    },
    {
      descripcion: 'Geríatrico hombre',
      cantidad: [24, 27, 48, 2],
    },
    {
      descripcion: 'Geríatrico Mujer',
      cantidad: [24, 27, 48, 2],
    },
  ];

  const downloadDocument = () => {
    // eslint-disable-next-line no-undef
    const imagenADocumento: any = document.getElementById('captura');

    html2canvas(imagenADocumento).then((canvas: any) => {
    // html2canvas(divToDisplay).then(() => {
      const divImage = canvas.toDataURL('image/png');
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', [280, 220]);

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(divImage, 0, 0, width, height);
      pdf.save(`reporte-${1}`);
    });
  };

  function calcularTotalPorTrimestre(actividadesOatenciones: any[], trimestre: number) {
    let total: number = 0;

    try {
      for (let i = 0; i < actividadesOatenciones.length; i += 1) {
        total += actividadesOatenciones[i].cantidad[trimestre];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    return total;
  }

  return (
    <>
      <button type="button" onClick={downloadDocument} id="btn-descargar" className="btn-primario">Descargar</button>
      <div id="captura">
        <div id="encabezado">
          <div id="cnt-escudo">
            <img id="escudo" src={escudo} alt="escudo-udg" />
          </div>

          <div id="cnt-titulos">
            <h1>UNIVERSIDAD DE GUADALAJARA</h1>
            <h3 className="centro-universitario">Centro Universitario de los Altos</h3>
            <h3>Secretaria Académica</h3>
            <h3>Coordinación de Extensión</h3>
            <h3>Unidad de Servicio Social</h3>
          </div>

        </div>
        <br />
        <br />

        <div>
          <h2>REPORTE TRIMESTRAL DE ACIVIDADES</h2>
          <table>
            <tbody>
              <tr>
                <td>Alumno:</td>
                <td>{testString}</td>
                <td>Código:</td>
                <td>{testString}</td>
              </tr>

              <tr>
                <td>Carrera:</td>
                <td>{testString}</td>
                <td>Horario:</td>
                <td>{testString}</td>
              </tr>

              <tr>
                <td>Entidad Receptora:</td>
                <td>{testString}</td>
                <td>Horas Realizadas:</td>
                <td>{testString}</td>
              </tr>

              <tr>
                <td>Receptor:</td>
                <td>{testString}</td>
                <td>Número de Reporte:</td>
                <td>{testString}</td>
              </tr>

              <tr>
                <td>Programa:</td>
                <td>{testString}</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <div>
          <div id="encabezado-fechas">
            <span>Fecha de Inicio:</span>
            <p>{testString}</p>
            <span>Fecha de Termianción:</span>
            <p>{testString}</p>
            <br />
            <br />
          </div>

          <table>
            <thead>
              <tr>
                <th>Actividades Realizadas</th>
                <th>Trimestre 1</th>
                <th>Trimestre 2</th>
                <th>Trimestre 3</th>
                <th>Trimestre 4</th>
                <th>Global</th>
              </tr>
            </thead>

            <tbody>
              {
                actividadesPrueba.map((actividad: any) => (
                  <tr>
                    <td>{actividad.descripcion}</td>
                    <td>{actividad.cantidad[0]}</td>
                    <td>{actividad.cantidad[1]}</td>
                    <td>{actividad.cantidad[2]}</td>
                    <td>{actividad.cantidad[3]}</td>
                    <td>
                      {actividad.cantidad[0]
                      + actividad.cantidad[1]
                      + actividad.cantidad[2]
                      + actividad.cantidad[3]}
                    </td>
                  </tr>
                ))
              }
              <tr>
                <td><span>Total</span></td>
                <td>{calcularTotalPorTrimestre(actividadesPrueba, 0)}</td>
                <td>{calcularTotalPorTrimestre(actividadesPrueba, 1)}</td>
                <td>{calcularTotalPorTrimestre(actividadesPrueba, 2)}</td>
                <td>{calcularTotalPorTrimestre(actividadesPrueba, 3)}</td>
                <td>
                  {
                    calcularTotalPorTrimestre(actividadesPrueba, 0)
                    + calcularTotalPorTrimestre(actividadesPrueba, 1)
                    + calcularTotalPorTrimestre(actividadesPrueba, 2)
                    + calcularTotalPorTrimestre(actividadesPrueba, 3)
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />

        <table>
          <thead>
            <tr>
              <th>Atenciones brindadas a pacientes:</th>
              <th>Trimestre 1</th>
              <th>Trimestre 2</th>
              <th>Trimestre 3</th>
              <th>Trimestre 4</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {
              atencionesPrueba.map((atencion: any) => (
                <tr>
                  <td>{atencion.descripcion}</td>
                  <td>{atencion.cantidad[0]}</td>
                  <td>{atencion.cantidad[1]}</td>
                  <td>{atencion.cantidad[2]}</td>
                  <td>{atencion.cantidad[3]}</td>
                  <td>
                    {atencion.cantidad[0]
                    + atencion.cantidad[1]
                    + atencion.cantidad[2]
                    + atencion.cantidad[3]}
                  </td>
                </tr>
              ))
            }
            <tr>
              <td><span>Total</span></td>
              <td>{calcularTotalPorTrimestre(atencionesPrueba, 0)}</td>
              <td>{calcularTotalPorTrimestre(atencionesPrueba, 1)}</td>
              <td>{calcularTotalPorTrimestre(atencionesPrueba, 2)}</td>
              <td>{calcularTotalPorTrimestre(atencionesPrueba, 3)}</td>
              <td>
                {
                  calcularTotalPorTrimestre(atencionesPrueba, 0)
                  + calcularTotalPorTrimestre(atencionesPrueba, 1)
                  + calcularTotalPorTrimestre(atencionesPrueba, 2)
                  + calcularTotalPorTrimestre(atencionesPrueba, 3)
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div>
            <img src={firma} alt="firma" />
            <hr />
            <span>NOMBRE Y FIRMA DEL PSS</span>
          </div>
          <div>
            <hr />
            <span>SELLO DE LA INSTITUCIÓN</span>
          </div>
          <div>
            <hr />
            <span>JEFE DE ENSEÑANZA O RECEPTOR</span>
          </div>
        </div>

        <div>
          <p>Av. Rafael Casillas Aceves No. 1200, Teapatitalán de Morelos, Jalisco, México</p>
          <p>Teléfono, 01 (378) 78 280 33 ext. 56823</p>
          <span>http://www.cualtos.udg.mx</span>
        </div>
        <br />

      </div>
    </>
  );
}

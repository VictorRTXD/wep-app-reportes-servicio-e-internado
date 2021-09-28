/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';
import firma from '../../../recursos/firma.png';

import '../../../global.css';
import './styles.css';
import Navegacion from '../../../componentes/BarraNavegacion';
import { ActividadesReporteParcial, AtencionesRealizadas } from '../../../recursos/interfaces';

export default function DocumentoReporteParcial() {
  const { numero } = useParams<{ numero: string }>();
  const numeroReporte = parseInt(numero, 10);
  const [documentStyles, setDocumentStyles] = useState({});
  const [wantToDownloadDocument, setWantToDownloadDocument] = useState(false);

  let redirect;

  const actividadesReporte: ActividadesReporteParcial[] = [];
  const atencionesRealizadas: AtencionesRealizadas[] = [
    {
      descripcion: 'Prenatales',
      cantidad: [],
    },
    {
      descripcion: 'Niños 0 a 12 años',
      cantidad: [],
    },
    {
      descripcion: 'Niñas 0 a 12 años',
      cantidad: [],
    },
    {
      descripcion: 'Onvres',
      cantidad: [],
    },
    {
      descripcion: 'Mujeres',
      cantidad: [],
    },
    {
      descripcion: 'Geríatrico hombre',
      cantidad: [],
    },
    {
      descripcion: 'Geríatrico Mujer',
      cantidad: [],
    },
  ];

  const servicio = {
    datosGenerales: JSON.parse(sessionStorage.getItem('servicioDatosGenerales') || 'null'),
    reportesParciales: JSON.parse(sessionStorage.getItem('reportesParciales') || 'null'),
    actividadesDeUsuario: JSON.parse(sessionStorage.getItem('actividadesDeUsuario') || 'null'),
  };

  if (servicio.reportesParciales) {
    if (servicio.reportesParciales[numeroReporte - 1]) {
      try {
        for (let i = 0; i < servicio.reportesParciales.length; i += 1) {
          // Mapear actividades
          for (let j = 0; j < servicio.reportesParciales[i].actividadesRealizadas.length; j += 1) {
            let indexActividadReporte: number = -1;

            // Buscar si ya esta lista
            for (let k = 0; k < actividadesReporte.length; k += 1) {
              if (actividadesReporte[k].id === servicio.reportesParciales[i].actividadesRealizadas[j].idActividad) {
                indexActividadReporte = k;
              }
            }

            if (indexActividadReporte >= 0) {
              actividadesReporte[indexActividadReporte].cantidad.push(servicio.reportesParciales[i].actividadesRealizadas[j].cantidad);
            } else {
              let indexActividadUsuario: number = -1;

              // Buscar la actividad de usuario correspondiento
              for (let k = 0; k < servicio.actividadesDeUsuario.length; k += 1) {
                if (servicio.actividadesDeUsuario[k].id === servicio.reportesParciales[i].actividadesRealizadas[j].idActividad) {
                  indexActividadUsuario = k;
                }
              }

              actividadesReporte.push({
                id: servicio.actividadesDeUsuario[indexActividadUsuario].id,
                descripcion: servicio.actividadesDeUsuario[indexActividadUsuario].descripcion,
                cantidad: [servicio.reportesParciales[i].actividadesRealizadas[j].cantidad],
              });
            }
          }

          // Mapear atenciones
          for (let j = 0; j < servicio.reportesParciales[i].atencionesRealizadas.length; j += 1) {
            atencionesRealizadas[j].cantidad.push(servicio.reportesParciales[i].atencionesRealizadas[j].cantidad);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error al mapear actividades');
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (numeroReporte === 1) {
        redirect = <Redirect to={`/reportes-parciales/${numeroReporte}/formulario`} />;
      } else if (!servicio.reportesParciales[numeroReporte - 2]) {
        console.log('No has completado el reporte anterior'); // Cambiar x modal
        redirect = <Redirect to={`/reportes-parciales/${numeroReporte - 2}/formulario`} />;
      } else {
        redirect = <Redirect to={`/reportes-parciales/${numeroReporte}/formulario`} />;
      }
    }
  }

  if (!servicio) {
    redirect = <Redirect to="/" />;
  }

  const fechaInicio = new Date(servicio.datosGenerales.fechaInicio);
  const fechaFin = new Date(servicio.datosGenerales.fechaFin);

  useEffect(() => {
    if (wantToDownloadDocument) {
      const imagenADocumento: any = document.getElementById('capturaReporteParcial');

      html2canvas(imagenADocumento).then((canvas: any) => {
        const divImage = canvas.toDataURL('image/png');
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF('p', 'mm', [280, 220]);

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(divImage, 0, 0, width, height);
        pdf.save(`Reporte Parcial #${numeroReporte}`);
      });
      setWantToDownloadDocument(false);
    } else {
      setDocumentStyles({});
    }
  }, [wantToDownloadDocument]);

  const downloadDocument = () => {
    setWantToDownloadDocument(true);
    setDocumentStyles({
      height: '280mm',
      width: '220mm',
      padding: '15mm',
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

    if (!total) {
      total = 0;
    }

    return total;
  }

  if (redirect) {
    return redirect;
  }

  return (
    <>
      <Navegacion />
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={downloadDocument} className="btn-primario">Descargar</button>
        <div className="ctn-btn-modificar">
          <Link to={`/reportes-parciales/${numeroReporte}/formulario`} id="btn-modificar" type="button" className="btn-secundario btn-modificar"> Modificar </Link>
        </div>
      </div>
      <br />

      <div id="capturaReporteParcial" style={documentStyles}>
        <Encabezado />
        <br />

        <div>
          <table id="tabla-datos-generales">
            <tbody>
              <tr>
                <th colSpan={4} className="celda-datos-generales">
                  <h2>REPORTE TRIMESTRAL DE ACTIVIDADES</h2>
                  <br />
                </th>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Alumno:</th>
                <td className="celda-datos-generales celda-valor">El Kevin</td>
                <th className="celda-datos-generales celda-campo">Código:</th>
                <td className="celda-datos-generales celda-valor">216788891</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Carrera:</th>
                <td className="celda-datos-generales celda-valor">INCO</td>
                <th className="celda-datos-generales celda-campo">Horario:</th>
                <td className="celda-datos-generales celda-valor">{`${servicio.datosGenerales.horarioHoraInicio} - ${servicio.datosGenerales.horarioHoraFin}`}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Entidad Receptora:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.entidadReceptora}</td>
                <th className="celda-datos-generales celda-campo">Horas Realizadas:</th>
                <td className="celda-datos-generales celda-valor">250 Hardcode, preguntar</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Receptor:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.receptor}</td>
                <th className="celda-datos-generales celda-campo">Número de Reporte:</th>
                <td className="celda-datos-generales celda-valor">{numeroReporte}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Programa:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.programa}</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <div>
          <div id="encabezado-fechas">
            <span className="fechas-campo">Fecha de Inicio:</span>
            <p className="fechas-valor">{`${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</p>
            <span className="fechas-campo">Fecha de Termianción:</span>
            <p className="fechas-valor">{`${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</p>
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
                actividadesReporte.map((actividad: any) => (
                  <tr key={actividad.id}>
                    <td>{actividad.descripcion}</td>
                    <td>{actividad.cantidad[0]}</td>
                    <td>{actividad.cantidad[1]}</td>
                    <td>{actividad.cantidad[2]}</td>
                    <td>{actividad.cantidad[3]}</td>
                    <td>
                      {actividad.cantidad[0] || 0
                      + actividad.cantidad[1] || 0
                      + actividad.cantidad[2] || 0
                      + actividad.cantidad[3] || 0}
                    </td>
                  </tr>
                ))
              }
              <tr>
                <th>Total</th>
                <td>{calcularTotalPorTrimestre(actividadesReporte, 0) || ''}</td>
                <td>{calcularTotalPorTrimestre(actividadesReporte, 1) || ''}</td>
                <td>{calcularTotalPorTrimestre(actividadesReporte, 2) || ''}</td>
                <td>{calcularTotalPorTrimestre(actividadesReporte, 3) || ''}</td>
                <td>
                  {
                    calcularTotalPorTrimestre(actividadesReporte, 0)
                    + calcularTotalPorTrimestre(actividadesReporte, 1)
                    + calcularTotalPorTrimestre(actividadesReporte, 2)
                    + calcularTotalPorTrimestre(actividadesReporte, 3)
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
              atencionesRealizadas.map((atencion: any, index: number) => (
                <tr key={index}>
                  <td>{atencion.descripcion}</td>
                  <td>{atencion.cantidad[0]}</td>
                  <td>{atencion.cantidad[1]}</td>
                  <td>{atencion.cantidad[2]}</td>
                  <td>{atencion.cantidad[3]}</td>
                  <td>
                    {atencion.cantidad[0] || 0
                    + atencion.cantidad[1] || 0
                    + atencion.cantidad[2] || 0
                    + atencion.cantidad[3] || 0}
                  </td>
                </tr>
              ))
            }
            <tr>
              <th>Total</th>
              <td>{calcularTotalPorTrimestre(atencionesRealizadas, 0) || ''}</td>
              <td>{calcularTotalPorTrimestre(atencionesRealizadas, 1) || ''}</td>
              <td>{calcularTotalPorTrimestre(atencionesRealizadas, 2) || ''}</td>
              <td>{calcularTotalPorTrimestre(atencionesRealizadas, 3) || ''}</td>
              <td>
                {
                  calcularTotalPorTrimestre(atencionesRealizadas, 0)
                  + calcularTotalPorTrimestre(atencionesRealizadas, 1)
                  + calcularTotalPorTrimestre(atencionesRealizadas, 2)
                  + calcularTotalPorTrimestre(atencionesRealizadas, 3)
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div className="ctn-firma">
            <hr />
            <span>NOMBRE Y FIRMA DEL PSS</span>
          </div>

          <div className="ctn-firma">
            <hr />
            <span>SELLO DE LA INSTITUCIÓN</span>
          </div>

          <div className="ctn-firma">
            <img id="firma" src={firma} alt="firma" />
            <hr />
            <span>JEFE DE ENSEÑANZA O RECEPTOR</span>
          </div>
        </div>

        <PiePagina />
        <br />

      </div>
    </>
  );
}

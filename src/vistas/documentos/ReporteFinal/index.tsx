/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, Redirect } from 'react-router-dom';

import Navegacion from '../../../componentes/BarraNavegacion';
import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';
import firma from '../../../recursos/firma.png';
import '../../../global.css';
import './styles.css';

interface ActividadesReporteParcial {
  id: number,
  descripcion: string,
  cantidad: number
}

export default function DocumentoReporteFinal() {
  const [documentStyles, setDocumentStyles] = useState({});
  const [wantToDownloadDocument, setWantToDownloadDocument] = useState(false);

  const actividadesReporte: ActividadesReporteParcial[] = [];

  const servicio = {
    datosGenerales: JSON.parse(sessionStorage.getItem('servicioDatosGenerales') || 'null'),
    reportesParciales: JSON.parse(sessionStorage.getItem('reportesParciales') || 'null'),
    actividadesDeUsuario: JSON.parse(sessionStorage.getItem('actividadesDeUsuario') || 'null'),
  };

  let redirect;

  if (servicio.reportesParciales) {
    // if (servicio.reportesParciales[4]) {
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
            actividadesReporte[indexActividadReporte].cantidad += servicio.reportesParciales[i].actividadesRealizadas[j].cantidad;
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
              cantidad: servicio.reportesParciales[i].actividadesRealizadas[j].cantidad,
            });
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error al mapear actividades');
    }
    // } else {
    //   // eslint-disable-next-line no-lonely-if
    //   console.log('No has completado todos los reportes'); // Cambiar x modal
    //   redirect = <Redirect to="/reportes-parciales/4/formulario" />;
    // }
  } else {
    redirect = <Redirect to="/servicio/crear" />;
  }

  const fechaInicio = new Date(servicio.datosGenerales.fechaInicio);
  const fechaFin = new Date(servicio.datosGenerales.fechaFin);

  useEffect(() => {
    if (wantToDownloadDocument) {
      const imagenADocumento: any = document.getElementById('capturaReporteFinal');

      html2canvas(imagenADocumento).then((canvas: any) => {
        const divImage = canvas.toDataURL('image/png');
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF('p', 'mm', [280, 220]);

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(divImage, 0, 0, width, height);
        pdf.save('Reporte Final');
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
          <Link to="/reporte-final/formulario" id="btn-modificar" type="button" className="btn-secundario btn-modificar"> Modificar </Link>
        </div>
      </div>
      <br />

      <div id="capturaReporteFinal" style={documentStyles}>
        <Encabezado />
        <br />
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
                <td className="celda-datos-generales celda-valor">126788891</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Carrera:</th>
                <td className="celda-datos-generales celda-valor">Inco</td>
                <th className="celda-datos-generales celda-campo">Horario:</th>
                <td className="celda-datos-generales celda-valor">{`${servicio.datosGenerales.horarioHoraInicio} - ${servicio.datosGenerales.horarioHoraFin}`}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Entidad Receptora:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.entidadReceptora}</td>
                <th className="celda-datos-generales celda-campo">Total de Horas:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.totalDeHoras}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Fecha Inicio:</th>
                <td className="celda-datos-generales celda-valor">{`${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</td>
                <th className="celda-datos-generales celda-campo">Fecha Fin:</th>
                <td className="celda-datos-generales celda-valor">{`${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Receptor:</th>
                <td className="celda-datos-generales celda-valor">{servicio.datosGenerales.receptor}</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <table>
          <tbody>
            <tr><th>Objetivos del Programa</th></tr>
            <tr><td>{servicio.datosGenerales.objetivosDelPrograma}</td></tr>
          </tbody>
        </table>
        <br />

        <table>
          <thead>
            <tr>
              <th>Actividades (Servicios) Realizadas</th>
              <th>Cantidad</th>
            </tr>
          </thead>

          <tbody>
            {
              actividadesReporte.map((actividad: any) => (
                <tr key={actividad.id}>
                  <td>{actividad.descripcion}</td>
                  <td>{actividad.cantidad}</td>
                </tr>
              ))
            }
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

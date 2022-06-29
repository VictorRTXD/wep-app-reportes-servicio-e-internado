/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Redirect } from 'react-router-dom';

import Navegacion from '../../../componentes/BarraNavegacion';
import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';

import '../../../global.css';
import './styles.css';
import Modal, { DatosModal } from '../../../componentes/Modal';
import obtenerCarrerra from '../../../recursos/obtenerCarrera';

interface ActividadesReporteParcial {
  id: number,
  descripcion: string,
  cantidad: number
}

export default function DocumentoReporteFinal() {
  // Obtener datos
  const datosGenerales = JSON.parse(sessionStorage.getItem('servicioDatosGenerales')!);
  const reportesParciales = JSON.parse(sessionStorage.getItem('reportesParciales')!);
  const actividadesDeUsuario = JSON.parse(sessionStorage.getItem('actividadesDeUsuario')!);
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  const [documentStyles, setDocumentStyles] = useState({});
  const [deseaDescargarDocumento, setDeseaDescargarDocumento] = useState(false);
  const [totalHoras, setTotalHoras] = useState(0);

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => { },
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const [actividadesReporte, setActividadesReporte] = useState<ActividadesReporteParcial[]>([]);

  const fechaInicio = new Date(datosGenerales.fechaInicio);
  const fechaFin = new Date(datosGenerales.fechaFin);

  useEffect(() => {
    const actividadesReporteAux: ActividadesReporteParcial[] = [];
    let horasAux = 0;
    if (reportesParciales.length === 4) {
      for (let i = 0; i < reportesParciales.length; i += 1) {
        // Mapear actividades
        for (let j = 0; j < reportesParciales[i].actividadesRealizadas.length; j += 1) {
          let indexActividadReporte: number = -1;

          // Buscar si ya esta lista
          for (let k = 0; k < actividadesReporte.length; k += 1) {
            if (actividadesReporteAux[k].id === reportesParciales[i].actividadesRealizadas[j].idActividad) {
              indexActividadReporte = k;
            }
          }

          if (indexActividadReporte >= 0) {
            actividadesReporteAux[indexActividadReporte].cantidad += Number(reportesParciales[i].actividadesRealizadas[j].cantidad);
          } else {
            let indexActividadUsuario: number = -1;

            // Buscar la actividad de usuario correspondiento
            for (let k = 0; k < actividadesDeUsuario.length; k += 1) {
              if (actividadesDeUsuario[k].id === reportesParciales[i].actividadesRealizadas[j].idActividad) {
                indexActividadUsuario = k;
              }
            }

            actividadesReporteAux.push({
              id: actividadesDeUsuario[indexActividadUsuario].id,
              descripcion: actividadesDeUsuario[indexActividadUsuario].descripcion,
              cantidad: Number(reportesParciales[i].actividadesRealizadas[j].cantidad),
            });
          }
        }

        horasAux += Number(reportesParciales[i].horasRealizadas);
      }
      setTotalHoras(horasAux);
      setActividadesReporte(actividadesReporteAux);
    } else if (redireccionamiento === '') {
      setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado todos los reportes',
        visibilidad: true,
        callback: () => { },
      });
    }
  }, []);

  useEffect(() => {
    if (deseaDescargarDocumento) {
      (async () => {
        // eslint-disable-next-line new-cap
        const doc = new jsPDF('p', 'mm', [280, 216]);

        // Crear imagen para el header
        const header: any = document.getElementById('encabezado');
        const canvasH = await html2canvas(header, { scale: 2 });
        const headerImage = canvasH.toDataURL('image/jpeg', 1.0);

        // Crear imagen para el encabezado de datos
        const datos: any = document.getElementById('tabla-datos-generales');
        const canvasD = await html2canvas(datos, { scale: 2 });
        const datosImage = canvasD.toDataURL('image/jpeg', 1.0);

        // Crear imagen para el footer de la página
        const footer: any = document.getElementById('pie-de-pagina');
        const canvasFo = await html2canvas(footer, { scale: 2 });
        const footerImage = canvasFo.toDataURL('image/jpeg', 1.0);

        // Crear imagen para la tabla de objetivos y añadirla al documento
        const objetivos: any = document.getElementById('tabla-objetivos');
        const canvasO = await html2canvas(objetivos, { scale: 2 });
        const objetivosImage = canvasO.toDataURL('image/jpeg', 1.0);
        doc.addImage(objetivosImage, 'JPEG', 20, 84, 177, 32);

        // Añadir tabla de actividades
        autoTable(doc, {
          html: '#tabla-actividades',
          theme: 'plain',
          styles: {
            font: 'courier',
            fontSize: 8,
            lineColor: 15,
            lineWidth: 0.3,
            textColor: 25,
          },
          headStyles: {
            halign: 'center',
            fillColor: [255, 255, 255],
            fontStyle: 'bold',
            lineColor: 15,
          },
          footStyles: { halign: 'center', fillColor: [255, 255, 255], fontStyle: 'bold' },
          showHead: 'firstPage',
          showFoot: 'lastPage',
          tableLineWidth: 0.3,
          tableLineColor: 15,
          startY: 120,
          margin: {
            top: 84, bottom: 40, left: 20, right: 19,
          },
          // eslint-disable-next-line no-unused-vars
          didDrawCell: (_data) => {
            doc.addImage(headerImage, 'JPEG', 18, 18, 177, 25); // Todas las posiciones están definidas en mm.
            doc.addImage(datosImage, 'JPEG', 20, 47, 177, 32);
          },
        });

        // Añadir a todas las páginas el footer y el número de página
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i += 1) {
          doc.setPage(i);
          doc.addImage(footerImage, 'JPEG', 68, 255, 80, 10);
          doc.setFontSize(6);
          doc.text(`Página ${i}/${pageCount}`, 180, 265);
        }

        doc.save(`Reporte Final 1 ${usuario.nombre}`);
        window.location.reload();
      })();
    } else {
      setDocumentStyles({
        position: 'relative',
        height: 'auto',
      });
    }
  }, [deseaDescargarDocumento]);

  const descargarDocumento = () => {
    setDeseaDescargarDocumento(true);
    setDocumentStyles({
      height: '280mm',
      width: '220mm',
      padding: '15mm',
      position: 'relative',
    });
  };

  function cerrarModal() {
    setDatosModal({
      tipo: null,
      texto: '',
      visibilidad: false,
      callback: () => { },
    });

    if (redireccionamiento) {
      setRetornar(true);
    }
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
        // eslint-disable-next-line react/jsx-no-bind
        callback={cerrarModal}
      />

      <Navegacion />

      <br />
      <h2 className="texto-encabezado">Documento Reporte Final</h2>
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={descargarDocumento} className="btn-primario">Descargar</button>
      </div>

      <br />

      <div id="documento">
        <br />
        <br />

        <div style={documentStyles} className="pagina">
          <Encabezado />
          <div className="br" />

          <div>
            <table id="tabla-datos-generales">
              <tbody>
                <tr>
                  <th colSpan={4} className="celda-datos-generales">
                    <h2>INFORME GLOBAL</h2>
                    <div className="br" />
                  </th>
                </tr>
                <tr>
                  <th className="celda-datos-generales celda-campo">Alumno:</th>
                  <td className="celda-datos-generales celda-valor">{usuario.nombre}</td>
                  <th className="celda-datos-generales celda-campo">Código:</th>
                  <td className="celda-datos-generales celda-valor">{usuario.id}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Carrera:</th>
                  <td className="celda-datos-generales celda-valor">{obtenerCarrerra(usuario.carrera)}</td>
                  <th className="celda-datos-generales celda-campo">Horario:</th>
                  <td className="celda-datos-generales celda-valor">{`${datosGenerales.horarioHoraInicio} - ${datosGenerales.horarioHoraFin}`}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Entidad Receptora:</th>
                  <td className="celda-datos-generales celda-valor">{datosGenerales.entidadReceptora}</td>
                  <th className="celda-datos-generales celda-campo">Total de Horas:</th>
                  <td className="celda-datos-generales celda-valor">{totalHoras}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Receptor:</th>
                  <td className="celda-datos-generales celda-valor">{datosGenerales.receptor}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Fecha de Inicio:</th>
                  <td className="celda-datos-generales celda-valor">{`${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</td>
                  <th className="celda-datos-generales celda-campo">Fecha de Terminación:</th>
                  <td className="celda-datos-generales celda-valor">{`${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</td>
                </tr>
                <div className="br" />
              </tbody>
            </table>
            <div className="br" />
            <div className="br" />
          </div>

          <>
            <table id="tabla-objetivos">
              <tbody>
                <tr><th id="titulo-objetivos">Objetivos del Programa</th></tr>
                <tr><td id="objetivos-del-programa-contenido">{datosGenerales.objetivosDelPrograma}</td></tr>
              </tbody>
            </table>
            <div className="br" />
          </>

          <table id="tabla-actividades">
            <thead>
              <tr className="fila-actividad">
                <th>Actividades (Servicios) Realizadas</th>
                <th>Cantidad</th>
              </tr>
            </thead>

            <tbody>
              {
                actividadesReporte.map((actividad: any) => (
                  <tr key={actividad.id} className="fila-actividad">
                    <td>{actividad.descripcion}</td>
                    <td>{actividad.cantidad}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <div className="espacio" />

          <PiePagina />

          <div className="br" />
        </div>

      </div>
    </>
  );
}

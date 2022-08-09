/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';
import FirmasDocumentos from '../componentes/Firmas';

import '../../../global.css';
import './styles.css';
import Navegacion from '../../../componentes/BarraNavegacion';
import Modal, { DatosModal } from '../../../componentes/Modal';
import obtenerCarrerra from '../../../recursos/obtenerCarrera';

interface ActividadesReporteParcial {
  id: number,
  descripcion: string,
  cantidad: number[]
}

interface AtencionesRealizadas {
  descripcion: string,
  cantidad: number[]
}

export default function DocumentoReporteParcial() {
  // Obtener datos
  const datosGenerales = JSON.parse(sessionStorage.getItem('servicioDatosGenerales')!);
  const reportesParciales = JSON.parse(sessionStorage.getItem('reportesParciales')!);
  const actividadesDeUsuario = JSON.parse(sessionStorage.getItem('actividadesDeUsuario')!);
  const trimestres = JSON.parse(sessionStorage.getItem('trimestres')!);
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  const { numero } = useParams<{ numero: string }>();
  const numeroReporte = parseInt(numero, 10);
  const [documentStyles, setDocumentStyles] = useState({});
  const [deseaDescargarDocumento, setDeseaDescargarDocumento] = useState(false);

  let fechaInicio!: string;
  let fechaFin!: string;

  if (trimestres[numeroReporte - 1]) {
    let splitAux: string[];
    splitAux = trimestres[numeroReporte - 1].fechaInicio.split('-');
    fechaInicio = `${splitAux[2].substring(0, 2)}/${splitAux[1]}/${splitAux[0]}`;
    splitAux = trimestres[numeroReporte - 1].fechaFin.split('-');
    fechaFin = `${splitAux[2].substring(0, 2)}/${splitAux[1]}/${splitAux[0]}`;
  }

  const [actividadesReporte, setActividadesReporte] = useState<ActividadesReporteParcial[]>([]);
  const [atencionesRealizadas, setAtencionesRealizadas] = useState<AtencionesRealizadas[]>([]);

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  useEffect(() => {
    const actividadesReporteAux: ActividadesReporteParcial[] = [];
    const atencionesRealizadasAux: AtencionesRealizadas[] = [
      {
        descripcion: 'Prenatales',
        cantidad: [],
      },
      {
        descripcion: 'Niños 0 a 12 años',
        cantidad: [],
      },
      {
        descripcion: 'Hombres',
        cantidad: [],
      },
      {
        descripcion: 'Mujeres',
        cantidad: [],
      },
      {
        descripcion: 'Geríatrico',
        cantidad: [],
      },
    ];

    if (reportesParciales.length >= numeroReporte) {
      // Mapear actividades
      for (let i = 0; i < actividadesDeUsuario.length; i += 1) {
        const cantidades = [];
        let tienePorLoMenosUnaActividad: boolean = false;

        for (let j = 0; j < numeroReporte; j += 1) {
          let reporteTieneActividad: boolean = false;

          for (let k = 0; k < reportesParciales[j].actividadesRealizadas.length; k += 1) {
            if (actividadesDeUsuario[i].id === reportesParciales[j].actividadesRealizadas[k].idActividad) {
              cantidades.push(reportesParciales[j].actividadesRealizadas[k].cantidad);
              reporteTieneActividad = true;
              tienePorLoMenosUnaActividad = true;
            }
          }

          if (!reporteTieneActividad) {
            cantidades.push(0);
          }
        }

        if (tienePorLoMenosUnaActividad) {
          actividadesReporteAux.push({
            id: actividadesDeUsuario[i].id,
            descripcion: actividadesDeUsuario[i].descripcion,
            cantidad: cantidades,
          });
        }
      }

      // Mapear atenciones
      for (let i = 0; i < numeroReporte; i += 1) {
        for (let j = 0; j < reportesParciales[i].atencionesRealizadas.length; j += 1) {
          atencionesRealizadasAux[j].cantidad.push(reportesParciales[i].atencionesRealizadas[j].cantidad);
        }
      }

      setActividadesReporte(actividadesReporteAux);
      setAtencionesRealizadas(atencionesRealizadasAux);
    } else if (redireccionamiento === '') {
      setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado este reporte',
        visibilidad: true,
        callback: () => {},
      });
    }
  }, [numeroReporte]);

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
        const datos: any = document.getElementById('tabla-reporte-trimestral');
        const canvasD = await html2canvas(datos, { scale: 2 });
        const datosImage = canvasD.toDataURL('image/jpeg', 1.0);

        // Crear imagen para el encabezado de fechas
        const fechas: any = document.getElementById('encabezado-fechas');
        const canvasF = await html2canvas(fechas, { scale: 2 });
        const fechasImage = canvasF.toDataURL('image/jpeg', 1.0);

        // Crear imagen para el apartado de firmas
        const firmas: any = document.getElementById('ctn-firmas');
        const canvasFi = await html2canvas(firmas, { scale: 2 });
        const firmasImage = canvasFi.toDataURL('image/jpeg', 1.0);

        // Crear imagen para el footer de la página
        const footer: any = document.getElementById('pie-de-pagina');
        const canvasFo = await html2canvas(footer, { scale: 2 });
        const footerImage = canvasFo.toDataURL('image/jpeg', 1.0);

        // Añadir tabla de actividades
        autoTable(doc, {
          html: '#tabla-actividades',
          theme: 'plain',
          styles: {
            font: 'helvetica',
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
          startY: 98,
          margin: {
            top: 84, bottom: 40, left: 20, right: 19,
          },
          didDrawCell: (_data) => {
            doc.addImage(headerImage, 'JPEG', 18, 18, 177, 25); // Todas las posiciones están definidas en mm.
            doc.addImage(datosImage, 'JPEG', 20, 47, 177, 32);
          },
        });

        // Añadir tabla de atenciones
        autoTable(doc, {
          html: '#tabla-atenciones',
          theme: 'plain',
          styles: {
            font: 'helvetica',
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
          margin: {
            top: 98, bottom: 70, left: 20, right: 19,
          },
          didDrawCell: (_data) => {
            doc.addImage(datosImage, 'JPEG', 20, 47, 177, 32);
            doc.addImage(headerImage, 'JPEG', 18, 18, 177, 25); // Todas las posiciones están definidas en mm.
          },
        });

        // Añadir a todas las páginas el footer y el número de página
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i += 1) {
          doc.setPage(i);
          if (i === pageCount) { // Poner firmas si es la última página
            doc.addImage(firmasImage, 'JPEG', 20, 230, 177, 45);
          }
          if (i === 1) { // Poner fechas si es la primera página
            doc.addImage(fechasImage, 'JPEG', 20, 84, 177, 13);
          }
          doc.addImage(footerImage, 'JPEG', 68, 255, 80, 10);
          doc.setFontSize(6);
          doc.text(`Página ${i}/${pageCount}`, 180, 265);
        }

        doc.save(`Reporte Parcial ${numeroReporte} ${usuario.nombre}`);
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
    setDocumentStyles({
      height: '280mm',
      width: '220mm',
      paddingTop: '15mm',
      paddingLeft: '15mm',
      paddingRight: '15mm',
      position: 'relative',
    });
    setDeseaDescargarDocumento(true);
  };

  function calcularTotalPorTrimestre(actividadesOatenciones: any[], trimestre: number) {
    let total: number = 0;

    try {
      for (let i = 0; i < actividadesOatenciones.length; i += 1) {
        total += parseInt(actividadesOatenciones[i].cantidad[trimestre], 10);
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
      <h2 className="texto-encabezado">{`Documento Reporte Parcial #${numeroReporte}`}</h2>
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={descargarDocumento} className="btn-primario">Descargar</button>
        <div className="ctn-btn-link">
          <Link to={`/reportes-parciales/${numeroReporte}/formulario`} id="btn-link" type="button" className="btn-secundario btn-link"> Modificar </Link>
        </div>
      </div>

      <br />

      <div id="documento">
        <br />
        <br />

        <div style={documentStyles} className="pagina">
          <Encabezado />
          <div className="br" />

          <div>
            <table id="tabla-reporte-trimestral">
              <tbody>
                <tr>
                  <th colSpan={4} className="celda-datos-generales">
                    <h2>REPORTE TRIMESTRAL DE ACTIVIDADES</h2>
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
                  <th className="celda-datos-generales celda-campo">Horas Realizadas:</th>
                  <td className="celda-datos-generales celda-valor">{reportesParciales[numeroReporte - 1]?.horasRealizadas || ''}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Receptor:</th>
                  <td className="celda-datos-generales celda-valor">{datosGenerales.receptor}</td>
                  <th className="celda-datos-generales celda-campo">Número de Reporte:</th>
                  <td className="celda-datos-generales celda-valor">{numeroReporte}</td>
                </tr>

                <tr>
                  <th className="celda-datos-generales celda-campo">Programa:</th>
                  <td className="celda-datos-generales celda-valor">{datosGenerales.programa}</td>
                </tr>
                <div className="br" />
              </tbody>
            </table>
            <div className="br" />
          </div>

          <div>
            <div id="encabezado-fechas">
              <span className="fechas-campo">Fecha de Inicio:</span>
              <p className="fechas-valor">{fechaInicio}</p>
              <span className="fechas-campo">Fecha de Fin:</span>
              <p className="fechas-valor">{fechaFin}</p>
              <div className="br" />
              <div className="br" />
            </div>

            <table id="tabla-actividades">
              <thead>
                <tr className="fila-actividad">
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
                    <tr key={actividad.id} className="fila-actividad">
                      <td className={(actividad.descripcion.length < 100 ? '' : 'reduced-size')}>{actividad.descripcion}</td>
                      <td>{actividad.cantidad[0] !== 0 ? actividad.cantidad[0] : ''}</td>
                      <td>{actividad.cantidad[1] !== 0 ? actividad.cantidad[1] : ''}</td>
                      <td>{actividad.cantidad[2] !== 0 ? actividad.cantidad[2] : ''}</td>
                      <td>{actividad.cantidad[3] !== 0 ? actividad.cantidad[3] : ''}</td>
                      <td>
                        {Number(actividad.cantidad[0])
                          + Number(actividad.cantidad[1] || 0)
                          + Number(actividad.cantidad[2] || 0)
                          + Number(actividad.cantidad[3] || 0)}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr className="fila-actividad">
                  <th>Total</th>
                  <td>{calcularTotalPorTrimestre(actividadesReporte, 0) || ''}</td>
                  <td>{calcularTotalPorTrimestre(actividadesReporte, 1) || ''}</td>
                  <td>{calcularTotalPorTrimestre(actividadesReporte, 2) || ''}</td>
                  <td>{calcularTotalPorTrimestre(actividadesReporte, 3) || ''}</td>
                  <td>
                    {calcularTotalPorTrimestre(actividadesReporte, 0)
                      + calcularTotalPorTrimestre(actividadesReporte, 1)
                      + calcularTotalPorTrimestre(actividadesReporte, 2)
                      + calcularTotalPorTrimestre(actividadesReporte, 3)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="br" />
            <div className="br" />

            <table id="tabla-atenciones">
              <thead>
                <tr className="fila-actividad">
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
                  atencionesRealizadas.map((atencion: any, indexAtencion: number) => (
                    <tr key={indexAtencion} className="fila-actividad">
                      <td>{atencion.descripcion}</td>
                      <td>{atencion.cantidad[0]}</td>
                      <td>{atencion.cantidad[1]}</td>
                      <td>{atencion.cantidad[2]}</td>
                      <td>{atencion.cantidad[3]}</td>
                      <td>
                        {Number(atencion.cantidad[0] || 0)
                        + Number(atencion.cantidad[1] || 0)
                        + Number(atencion.cantidad[2] || 0)
                        + Number(atencion.cantidad[3] || 0)}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
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
              </tfoot>
            </table>

          </div>

          <div className="espacio" />

          <FirmasDocumentos />
          <PiePagina />

          <div className="br" />
        </div>
      </div>
    </>
  );
}

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
import Modal, { DatosModal } from '../../../componentes/Modal';

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
      descripcion: 'Hombres',
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

  let fechaInicio = new Date(0);
  let fechaFin = new Date(0);

  if (trimestres[numeroReporte - 1]) {
    fechaInicio = new Date(trimestres[numeroReporte - 1].fechaInicio);
    fechaFin = new Date(trimestres[numeroReporte - 1].fechaFin);
  }

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

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
        actividadesReporte.push({
          id: actividadesDeUsuario[i].id,
          descripcion: actividadesDeUsuario[i].descripcion,
          cantidad: cantidades,
        });
      }
    }

    // Mapear atenciones
    for (let i = 0; i < numeroReporte; i += 1) {
      for (let j = 0; j < reportesParciales[i].atencionesRealizadas.length; j += 1) {
        atencionesRealizadas[j].cantidad.push(reportesParciales[i].atencionesRealizadas[j].cantidad);
      }
    }
  } else if (redireccionamiento === '') {
    setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

    setDatosModal({
      tipo: 'error',
      texto: 'No has completado este reporte',
      visibilidad: true,
      callback: () => {},
    });
  }

  useEffect(() => {
    if (deseaDescargarDocumento) {
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
      setDeseaDescargarDocumento(false);
    } else {
      setDocumentStyles({});
    }
  }, [deseaDescargarDocumento]);

  const descargarDocumento = () => {
    setDocumentStyles({
      height: '280mm',
      width: '220mm',
      padding: '15mm',
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

      <div id="capturaReporteParcial" style={documentStyles}>
        <Encabezado />
        <br />

        <div>
          <table>
            <tbody>
              <tr>
                <th colSpan={4} className="celda-datos-generales">
                  <h2>REPORTE TRIMESTRAL DE ACTIVIDADES</h2>
                  <br />
                </th>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Alumno:</th>
                <td className="celda-datos-generales celda-valor">{usuario.nombre}</td>
                <th className="celda-datos-generales celda-campo">Código:</th>
                <td className="celda-datos-generales celda-valor">{usuario.codigo}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Carrera:</th>
                <td className="celda-datos-generales celda-valor">{usuario.carrera}</td>
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
            </tbody>
          </table>
          <br />
        </div>

        <div>
          <div id="encabezado-fechas">
            <span className="fechas-campo">Fecha de Inicio:</span>
            <p className="fechas-valor">{`${fechaInicio.getDate() + 1}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</p>
            <span className="fechas-campo">Fecha de Fin:</span>
            <p className="fechas-valor">{`${fechaFin.getDate() + 1}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</p>
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
                    {Number(atencion.cantidad[0] || 0)
                    + Number(atencion.cantidad[1] || 0)
                    + Number(atencion.cantidad[2] || 0)
                    + Number(atencion.cantidad[3] || 0)}
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
            <img id="firma" src={firma} alt="firma" />
            <hr />
            <span>SELLO DE LA INSTITUCIÓN</span>
          </div>

          <div className="ctn-firma">
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

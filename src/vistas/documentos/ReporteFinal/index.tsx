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
import Modal, { DatosModal } from '../../../componentes/Modal';

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

  const [documentStyles, setDocumentStyles] = useState({});
  const [deseaDescargarDocumento, setDeseaDescargarDocumento] = useState(false);

  const actividadesReporte: ActividadesReporteParcial[] = [];

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  if (reportesParciales === 4) {
    for (let i = 0; i < reportesParciales.length; i += 1) {
      // Mapear actividades
      for (let j = 0; j < reportesParciales[i].actividadesRealizadas.length; j += 1) {
        let indexActividadReporte: number = -1;

        // Buscar si ya esta lista
        for (let k = 0; k < actividadesReporte.length; k += 1) {
          if (actividadesReporte[k].id === reportesParciales[i].actividadesRealizadas[j].idActividad) {
            indexActividadReporte = k;
          }
        }

        if (indexActividadReporte >= 0) {
          actividadesReporte[indexActividadReporte].cantidad += reportesParciales[i].actividadesRealizadas[j].cantidad;
        } else {
          let indexActividadUsuario: number = -1;

          // Buscar la actividad de usuario correspondiento
          for (let k = 0; k < actividadesDeUsuario.length; k += 1) {
            if (actividadesDeUsuario[k].id === reportesParciales[i].actividadesRealizadas[j].idActividad) {
              indexActividadUsuario = k;
            }
          }

          actividadesReporte.push({
            id: actividadesDeUsuario[indexActividadUsuario].id,
            descripcion: actividadesDeUsuario[indexActividadUsuario].descripcion,
            cantidad: reportesParciales[i].actividadesRealizadas[j].cantidad,
          });
        }
      }
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    setRedireccionamiento('/reportes-parciales/4/formulario');

    setDatosModal({
      tipo: 'error',
      texto: 'No has completado todos los reportes',
      visibilidad: true,
      callback: () => {},
    });
  }

  const fechaInicio = new Date(datosGenerales.fechaInicio);
  const fechaFin = new Date(datosGenerales.fechaFin);

  useEffect(() => {
    if (deseaDescargarDocumento) {
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
      setDeseaDescargarDocumento(false);
    } else {
      setDocumentStyles({});
    }
  }, [deseaDescargarDocumento]);

  const descargarDocumento = () => {
    setDeseaDescargarDocumento(true);
    setDocumentStyles({
      height: '280mm',
      width: '220mm',
      padding: '15mm',
    });
  };

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
    <>
      <Modal
        tipo={datosModal.tipo}
        texto={datosModal.texto}
        visibilidad={datosModal.visibilidad}
        callback={cerrarModal}
      />

      <Navegacion />
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={descargarDocumento} className="btn-primario">Descargar</button>
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
                <td className="celda-datos-generales celda-valor">{`${datosGenerales.horarioHoraInicio} - ${datosGenerales.horarioHoraFin}`}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Entidad Receptora:</th>
                <td className="celda-datos-generales celda-valor">{datosGenerales.entidadReceptora}</td>
                <th className="celda-datos-generales celda-campo">Total de Horas:</th>
                <td className="celda-datos-generales celda-valor">{datosGenerales.totalDeHoras}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Fecha Inicio:</th>
                <td className="celda-datos-generales celda-valor">{`${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</td>
                <th className="celda-datos-generales celda-campo">Fecha Fin:</th>
                <td className="celda-datos-generales celda-valor">{`${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</td>
              </tr>

              <tr>
                <th className="celda-datos-generales celda-campo">Receptor:</th>
                <td className="celda-datos-generales celda-valor">{datosGenerales.receptor}</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <table>
          <tbody>
            <tr><th>Objetivos del Programa</th></tr>
            <tr><td>{datosGenerales.objetivosDelPrograma}</td></tr>
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

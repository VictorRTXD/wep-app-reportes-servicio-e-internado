/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, Redirect } from 'react-router-dom';

import Navegacion from '../../../componentes/BarraNavegacion';
import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';

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
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  const [documentStyles, setDocumentStyles] = useState({});
  const [deseaDescargarDocumento, setDeseaDescargarDocumento] = useState(false);

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => { },
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  const [paginas, setPaginas] = useState<any[][]>([]);

  let totalHoras = 0;

  const fechaInicio = new Date(datosGenerales.fechaInicio);
  const fechaFin = new Date(datosGenerales.fechaFin);

  useEffect(() => {
    const actividadesReporte: ActividadesReporteParcial[] = [];

    if (reportesParciales.length === 4) {
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
            actividadesReporte[indexActividadReporte].cantidad += Number(reportesParciales[i].actividadesRealizadas[j].cantidad);
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
              cantidad: Number(reportesParciales[i].actividadesRealizadas[j].cantidad),
            });
          }
        }

        totalHoras += reportesParciales[i].horasRealizadas;
      }
    } else if (redireccionamiento === '') {
      setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado todos los reportes',
        visibilidad: true,
        callback: () => { },
      });
    }

    // Dividir activiadades en paginas
    let i = 0;

    // Primera hoja que es diferente, le caben 18, todo esta maquetado en cm
    const primeraPagina: any[] = [];

    while (i < actividadesReporte.length && i < 18) {
      primeraPagina.push({
        id: actividadesReporte[i].id,
        descripcion: actividadesReporte[i].descripcion,
        cantidad: actividadesReporte[i].cantidad,
      });
      i += 1;
    }

    i = 18;
    const pagingasAux: any[] = [primeraPagina];

    while (i < actividadesReporte.length) {
      let j = i;
      const activiades: any[] = [];

      while (j < i + 30 && j < actividadesReporte.length) {
        activiades.push({
          id: actividadesReporte[j].id,
          descripcion: actividadesReporte[j].descripcion,
          cantidad: actividadesReporte[j].cantidad,
        });

        j += 1;
      }

      pagingasAux.push(activiades);
      i += j;
    }

    setPaginas(pagingasAux);
  }, []);

  useEffect(() => {
    if (deseaDescargarDocumento) {
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', [280, 220]);
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      (async () => {
        for (let i = 0; i < paginas.length; i += 1) {
          const htmlElement: any = document.getElementById(`Pagina_${i}`);
          // eslint-disable-next-line no-await-in-loop
          const canvas = await html2canvas(htmlElement);
          const divImage = canvas.toDataURL('image/png');
          if (i === 0) {
            pdf.addImage(divImage, 0, 0, width, height);
          } else {
            pdf.addPage().addImage(divImage, 0, 0, width, height);
          }
        }

        pdf.save(`Reporte Final ${usuario.nombre}`);
        setDeseaDescargarDocumento(false);
      })();
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
        callback={cerrarModal}
      />

      <Navegacion />
      <div className="br" />

      <h2 className="texto-encabezado">Documento Reporte Final</h2>
      <div className="br" />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={descargarDocumento} className="btn-primario">Descargar</button>
        <div className="ctn-btn-link">
          <Link to="/reporte-final/formulario" type="button" className="btn-secundario btn-link"> Modificar </Link>
        </div>
      </div>
      <div className="br" />

      {
        paginas.map((pagina, index) => (
          <div key={`Pagina_${index}`}>
            <br />
            <br />

            <div id={`Pagina_${index}`} style={documentStyles}>
              <Encabezado />
              <div className="br" />

              {
                index === 0
                && (
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
                          <td className="celda-datos-generales celda-valor">{usuario.carrera}</td>
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
                    <div className="br" />
                  </div>
                )
              }

              {
                index === 0
                && (
                  <>
                    <table id="tabla-objetivos">
                      <tbody>
                        <tr><th id="titulo-objetivos">Objetivos del Programa</th></tr>
                        <tr><td id="objetivos-del-programa-contenido">{datosGenerales.objetivosDelPrograma}</td></tr>
                      </tbody>
                    </table>
                    <div className="br" />
                  </>
                )
              }

              <table>
                <thead>
                  <tr className="fila-actividad">
                    <th>Actividades (Servicios) Realizadas</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    pagina.map((actividad: any) => (
                      <tr key={actividad.id} className="fila-actividad">
                        <td>{actividad.descripcion}</td>
                        <td>{actividad.cantidad}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <div className="ctn-firmas">
                <div className="ctn-firma">
                  <hr />
                  <span>NOMBRE Y FIRMA DEL PSS</span>
                </div>

                <div className="ctn-firma">
                  <hr />
                  <span>SELLO DE LA INSTITUCIÓN</span>
                </div>

                <div className="ctn-firma">
                  <hr />
                  <span>JEFE DE ENSEÑANZA O RECEPTOR</span>
                </div>
              </div>

              <div className="numero-de-pagina">
                <p>
                  {`Página ${index + 1} de ${paginas.length}`}
                </p>
              </div>

              <PiePagina />
            </div>

            {/* Esto no sale en el documento */}
            <br />
            <br />
            <br />
            <br />
            <br />

            <hr className="salto-pagina" />
          </div>
        ))
      }
    </>
  );
}

/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Encabezado from '../componentes/Encabezado';
import PiePagina from '../componentes/PiePagina';

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

  let fechaInicio = new Date(0);
  let fechaFin = new Date(0);

  if (trimestres[numeroReporte - 1]) {
    fechaInicio = new Date(trimestres[numeroReporte - 1].fechaInicio);
    fechaFin = new Date(trimestres[numeroReporte - 1].fechaFin);
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

  const [paginas, setPaginas] = useState<any[][]>([]);
  const [atencionesVanEnUnaNuevaPagina, setAtencionesVanEnUnaNuevaPagina] = useState<boolean>(false);

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

    // Dividir activiadades en paginas
    let i = 0;

    // Primera hoja que es diferente, le caben 18, todo esta maquetado en cm
    const primeraPagina: any[] = [];

    while (i < actividadesReporteAux.length && i < 18) {
      primeraPagina.push({
        id: actividadesReporteAux[i].id,
        descripcion: actividadesReporteAux[i].descripcion,
        cantidad: actividadesReporteAux[i].cantidad,
      });
      i += 1;
    }

    i = 18;
    const pagingasAux: any[] = [primeraPagina];

    while (i < actividadesReporteAux.length) {
      let j = i;
      const activiades: any[] = [];

      while (j < i + 24 && j < actividadesReporteAux.length) {
        activiades.push({
          id: actividadesReporteAux[j].id,
          descripcion: actividadesReporteAux[j].descripcion,
          cantidad: actividadesReporteAux[j].cantidad,
        });

        j += 1;
      }

      pagingasAux.push(activiades);
      i += j;
    }

    if (pagingasAux[pagingasAux.length - 1].length > 16) {
      setAtencionesVanEnUnaNuevaPagina(true);
    }

    setPaginas(pagingasAux);
  }, [numeroReporte]);

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

        if (atencionesVanEnUnaNuevaPagina) {
          const htmlElement: any = document.getElementById('atenciones-realizadas');
          const canvas = await html2canvas(htmlElement);
          const divImage = canvas.toDataURL('image/png');
          pdf.addPage().addImage(divImage, 0, 0, width, height);
        }

        pdf.save(`Reporte Parcial ${numeroReporte} ${usuario.nombre}`);
        setDeseaDescargarDocumento(false);
      })();
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

      { paginas.map((pagina, index) => (
        <div key={`Pagina_${index}`}>
          <br />
          <br />

          <div id={`Pagina_${index}`} style={documentStyles}>
            <Encabezado />
            <div className="br" />

            {index === 0
            && (
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
                </tbody>
              </table>
              <div className="br" />
            </div>
            )}

            <div>
              <div id="encabezado-fechas">
                <span className="fechas-campo">Fecha de Inicio:</span>
                <p className="fechas-valor">{`${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getUTCFullYear()}`}</p>
                <span className="fechas-campo">Fecha de Fin:</span>
                <p className="fechas-valor">{`${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getUTCFullYear()}`}</p>
                <div className="br" />
                <div className="br" />
              </div>

              <table>
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
                    pagina.map((actividad: any) => (
                      <tr key={actividad.id} className="fila-actividad">
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
                  <tr className="fila-actividad">
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
            <div className="br" />

            {
              atencionesVanEnUnaNuevaPagina === false
              && (
                <table>
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
              )
            }

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
                {`Página ${index + 1} de ${paginas.length + (atencionesVanEnUnaNuevaPagina ? 1 : 0)}`}
              </p>
            </div>

            <PiePagina />
            <div className="br" />
          </div>

          <br />
          <br />
          <hr className="salto-pagina" />
        </div>
      ))}

      {/* Si no caben las atenciones en la ultima hoja */}
      {
        atencionesVanEnUnaNuevaPagina
        && (
          <div>
            <br />
            <br />

            <div id="atenciones-realizadas" style={documentStyles}>
              <Encabezado />
              <div className="br" />

              <table>
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
              <div className="br" />

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
                  {`Página ${paginas.length + 1} de ${paginas.length + 1}`}
                </p>
              </div>

              <PiePagina />
              <div className="br" />
            </div>
          </div>
        )
      }
    </>
  );
}

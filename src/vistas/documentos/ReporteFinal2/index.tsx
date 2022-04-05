/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, Redirect } from 'react-router-dom';

import Encabezado from '../componentes/Encabezado';

import '../../../global.css';
import './styles.css';
import PiePagina from '../componentes/PiePagina';
import Navegacion from '../../../componentes/BarraNavegacion';
import appConfig from '../../../appConfig';
import Modal, { DatosModal } from '../../../componentes/Modal';

export default function DocumentoReporteFinal2() {
  const [documentStyles, setDocumentStyles] = useState({});
  const [deseaDescargarDocumento, setDeseaDescargarDocumento] = useState(false);

  const atencionesRealizadas: any[] = [
    {
      descripcion: 'Prenatales',
      cantidad: 0,
    },
    {
      descripcion: 'Niños 0 a 12 años',
      cantidad: 0,
    },
    {
      descripcion: 'Hombres',
      cantidad: 0,
    },
    {
      descripcion: 'Mujeres',
      cantidad: 0,
    },
    {
      descripcion: 'Geríatrico',
      cantidad: 0,
    },
  ];

  // Obtener datos
  const reportesParciales = JSON.parse(sessionStorage.getItem('reportesParciales')!);
  const reporteFinalDos = JSON.parse(sessionStorage.getItem('reporteFinalDos')!);
  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  let totalActividadesRealizadas: number = 0;
  let totalDeAtenciones: number = 0;

  const [datosModal, setDatosModal] = useState<DatosModal>({
    tipo: null,
    texto: '',
    visibilidad: false,
    callback: () => {},
  });
  const [retornar, setRetornar] = useState(false);
  const [redireccionamiento, setRedireccionamiento] = useState('');

  if (Object.entries(reporteFinalDos).length <= 0) {
    if (redireccionamiento === '') {
      setRedireccionamiento('/reporte-final-2/formulario');

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado este reporte',
        visibilidad: true,
        callback: () => {},
      });
    }
  }

  if (reportesParciales.length === 4) {
    try {
      for (let i = 0; i < reportesParciales.length; i += 1) {
        // Sumar actividades
        for (let j = 0; j < reportesParciales[i].actividadesRealizadas.length; j += 1) {
          totalActividadesRealizadas += Number(reportesParciales[i].actividadesRealizadas[j].cantidad);
        }

        // Sumar atenciones
        for (let j = 0; j < reportesParciales[i].atencionesRealizadas.length; j += 1) {
          atencionesRealizadas[j].cantidad += reportesParciales[i].atencionesRealizadas[j].cantidad;
          totalDeAtenciones += Number(reportesParciales[i].atencionesRealizadas[j].cantidad);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error al mapear actividades');
    }
  } else if (redireccionamiento === '') {
    if (redireccionamiento === '') {
      setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado todos los reportes',
        visibilidad: true,
        callback: () => {},
      });
    }
  }

  useEffect(() => {
    if (deseaDescargarDocumento) {
      const imagenADocumento: any = document.getElementById('capturaReporteFinal2');

      html2canvas(imagenADocumento, { scale: 2 }).then((canvas: any) => {
        const divImage = canvas.toDataURL('image/jpeg', 1.0);
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF('p', 'mm', [280, 220]);

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(divImage, 0, 0, width, height);
        pdf.save(`Reporte Final 2 ${usuario.nombre}`);
      });
      setDeseaDescargarDocumento(false);
    } else {
      setDocumentStyles({
        position: 'relative',
        height: '280mm',
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

      <h2 className="texto-encabezado">Documento Reporte Final 2</h2>
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={descargarDocumento} className="btn-primario">Descargar</button>
        <div className="ctn-btn-link">
          <Link to="/reporte-final-2/formulario" id="btn-link" type="button" className="btn-secundario btn-link"> Modificar </Link>
        </div>
      </div>
      <br />
      <br />
      <div id="capturaReporteFinal2" style={documentStyles} className="pagina">
        <Encabezado />
        <br />
        <br />

        <table>
          <tbody>
            <tr>
              <td>Total de Actividades Realizadas:</td>
              <th>{totalActividadesRealizadas}</th>
            </tr>
          </tbody>
        </table>
        <br />

        <table>
          <tbody>
            <tr><th>Metas Alcanzadas:</th></tr>
            <tr><td>{reporteFinalDos.metasAlcanzadas}</td></tr>
          </tbody>
        </table>
        <br />

        <table>
          <tbody>
            <tr><th>Metodología Utilizada:</th></tr>
            <tr><td>{reporteFinalDos.metodologiaUtilizada}</td></tr>
          </tbody>
        </table>
        <br />

        <table>
          <tbody>
            <tr><th>Innovación Aportada:</th></tr>
            <tr><td>{reporteFinalDos.innovacionAportada}</td></tr>
          </tbody>
        </table>
        <br />

        <table>
          <tbody>
            <tr><th>Conclusiones:</th></tr>
            <tr><td>{reporteFinalDos.conclusiones}</td></tr>
          </tbody>
        </table>
        <br />

        <table>
          <tbody>
            <tr><th>Propuestas</th></tr>
            <tr><td>{reporteFinalDos.propuestas}</td></tr>
          </tbody>
        </table>
        <br />
        <br />

        <table id="reporte-final-2-tabla-atenciones-realizadas">
          <th colSpan={4}>Atenciones Brindadas</th>
          <tbody>
            <tr>
              <th className="border-unset">Mujeres:</th>
              <td className="border-unset">{atencionesRealizadas[3].cantidad}</td>
              <th className="border-unset">Niños:</th>
              <td className="border-unset">{atencionesRealizadas[1].cantidad}</td>
            </tr>

            <tr>
              <th className="border-unset">Hombres:</th>
              <td className="border-unset">{atencionesRealizadas[2].cantidad}</td>
              <th className="border-unset">Prenatales:</th>
              <td className="border-unset">{atencionesRealizadas[0].cantidad}</td>
            </tr>

            <tr>
              <th className="border-unset">Geríatricos:</th>
              <td className="border-unset">{atencionesRealizadas[4].cantidad}</td>
              <th className="border-unset">Total de Atenciones:</th>
              <td className="border-unset">{totalDeAtenciones}</td>
            </tr>
          </tbody>
        </table>

        <div className="ctn-firmas">
          <div className="ctn-firma">
            <hr />
            <span>{usuario.nombre}</span>
            <br />
            <span>ㅤ</span>
          </div>

          <div className="ctn-firma">
            <hr />
            <span>{appConfig.responsableServicio}</span>
            <br />
            <span>Jefe de la Unidad de Servicio Social</span>
          </div>

          <div className="ctn-firma">
            <hr />
            <span>Nombre sello y firma</span>
            <br />
            <span>Jefe de Enseñanza o Receptor</span>
          </div>
        </div>

        <PiePagina />
        <br />

      </div>
      <br />
    </>
  );
}

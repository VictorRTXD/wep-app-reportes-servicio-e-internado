import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, Redirect } from 'react-router-dom';

import Encabezado from '../componentes/Encabezado';
import firma from '../../../recursos/firma.png';

import '../../../global.css';
import PiePagina from '../componentes/PiePagina';
import Navegacion from '../../../componentes/BarraNavegacion';

export default function DocumentoReporteFinal2() {
  const [documentStyles, setDocumentStyles] = useState({});
  const [wantToDownloadDocument, setWantToDownloadDocument] = useState(false);
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi quas esse eligendi magnam consequatur culpa soluta aspernatur, obcaecati sit corporis doloremque, commodi pariatur. Saepe inventore quaerat a consequatur dolores voluptatum.';

  const servicio = {
    datosGenerales: JSON.parse(sessionStorage.getItem('servicioDatosGenerales') || 'null'),
    reportesParciales: JSON.parse(sessionStorage.getItem('reportesParciales') || 'null'),
    reporteFinal2: JSON.parse(sessionStorage.getItem('reporteFinalDos') || 'null'),
  };

  if (!servicio.datosGenerales) {
    return <Redirect to="/" />;
  }

  useEffect(() => {
    if (wantToDownloadDocument) {
      const imagenADocumento: any = document.getElementById('capturaReporteFinal2');

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

  return (
    <>
      <Navegacion />
      <br />

      <div className="ctn-btns-descargar-y-modificar">
        <button type="button" onClick={downloadDocument} className="btn-primario">Descargar</button>
        <div className="ctn-btn-modificar">
          <Link to="/reporte-final-2/formulario" id="btn-modificar" type="button" className="btn-secundario btn-modificar"> Modificar </Link>
        </div>
      </div>
      <br />

      <div id="capturaReporteFinal2" style={documentStyles}>
        <Encabezado />
        <br />
        <br />

        <table>
          <tr>
            <td>Total de Actividades Realizadas:</td>
            <th>283</th>
          </tr>
        </table>
        <br />

        <table>
          <tr><th>Metas Alcanzadas:</th></tr>
          <tr><td>{loremIpsum}</td></tr>
        </table>
        <br />

        <table>
          <tr><th>Metodología Utilizada:</th></tr>
          <tr><td>{loremIpsum}</td></tr>
        </table>
        <br />

        <table>
          <tr><th>Innovación Aportada:</th></tr>
          <tr><td>{loremIpsum}</td></tr>
        </table>
        <br />

        <table>
          <tr><th>Conclusiones:</th></tr>
          <tr><td>{loremIpsum}</td></tr>
        </table>
        <br />

        <table>
          <tr><th>Propuestas</th></tr>
          <tr><td>{loremIpsum}</td></tr>
        </table>
        <br />

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

/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link, Redirect } from 'react-router-dom';

import Encabezado from '../componentes/Encabezado';
import firma from '../../../recursos/firma.png';

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
      descripcion: 'Niñas 0 a 12 años',
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
      descripcion: 'Geríatrico hombre',
      cantidad: 0,
    },
    {
      descripcion: 'Geríatrico Mujer',
      cantidad: 0,
    },
  ];

  // Obtener datos
  const reportesParciales = JSON.parse(sessionStorage.getItem('reportesParciales')!);
  const reporteFinalDos = JSON.parse(sessionStorage.getItem('reporteFinalDos')!);

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

  useEffect(() => {
    if (reporteFinalDos) {
      if (Object.entries(reporteFinalDos).length <= 0) {
        setRedireccionamiento('/reporte-final-2/formulario');

        setDatosModal({
          tipo: 'error',
          texto: 'No has completado este reporte',
          visibilidad: true,
          callback: () => {},
        });
      }
    } else {
      setRedireccionamiento('/reporte-final-2/formulario');

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado este reporte',
        visibilidad: true,
        callback: () => {},
      });
    }

    if (reportesParciales.length === 4) {
      try {
        for (let i = 0; i < reportesParciales.length; i += 1) {
          // Sumar actividades
          for (let j = 0; j < reportesParciales[i].actividadesRealizadas.length; j += 1) {
            totalActividadesRealizadas += reportesParciales[i].actividadesRealizadas[j].cantidad;
          }

          // Sumar atenciones
          for (let j = 0; j < reportesParciales[i].atencionesRealizadas.length; j += 1) {
            atencionesRealizadas[j].cantidad = reportesParciales[i].atencionesRealizadas[j].cantidad;
            totalDeAtenciones += reportesParciales[i].atencionesRealizadas[j].cantidad;
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error al mapear actividades');
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      setRedireccionamiento(`/reportes-parciales/${reportesParciales.length + 1}/formulario`);

      setDatosModal({
        tipo: 'error',
        texto: 'No has completado todos los reportes',
        visibilidad: true,
        callback: () => {},
      });
    }
  }, ['Esto solo se ejecuta una vez']);

  useEffect(() => {
    if (deseaDescargarDocumento) {
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
          <Link to="/reporte-final-2/formulario" id="btn-modificar" type="button" className="btn-secundario btn-modificar"> Modificar </Link>
        </div>
      </div>
      <br />

      <div id="capturaReporteFinal2" style={documentStyles}>
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
          <tbody>
            <tr>
              <th className="border-unset">Mujeres:</th>
              <td className="border-unset">{atencionesRealizadas[4].cantidad}</td>
              <th className="border-unset">Niños:</th>
              <td className="border-unset">{atencionesRealizadas[1].cantidad + atencionesRealizadas[2].cantidad}</td>
            </tr>

            <tr>
              <th className="border-unset">Hombres:</th>
              <td className="border-unset">{atencionesRealizadas[3].cantidad}</td>
              <th className="border-unset">Prenatales:</th>
              <td className="border-unset">{atencionesRealizadas[0].cantidad + atencionesRealizadas[2].cantidad}</td>
            </tr>

            <tr>
              <th className="border-unset">Geríatricos:</th>
              <td className="border-unset">{atencionesRealizadas[5].cantidad + atencionesRealizadas[6].cantidad}</td>
              <th className="border-unset">Total de Atenciones:</th>
              <td className="border-unset">{totalDeAtenciones}</td>
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
            <span>{appConfig.responsableServicio}</span>
            <span>Jefe de la Unidad de Servicio Social</span>
          </div>

          <div className="ctn-firma">
            <hr />
            <span>Nombre sell y firma</span>
            <span>Jefe de Enseñanza o Receptor</span>
          </div>
        </div>

        <PiePagina />
        <br />

      </div>
    </>
  );
}

import React from 'react';
import './global.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PaginaPrincipal from './vistas/PaginaPrincipal/index';
import formularioServicio from './vistas/formularioServicio';
import ReportesParciales from './vistas/formulariosDeReporte/ReporteParcial';
import ReporteFinal2 from './vistas/formulariosDeReporte/ReporteFinal2';
import Sesion from './vistas/IniciarSesion';

// Documentos
import DocumentoReporteParcial from './vistas/documentos/ReporteParcial';
import DocumentoReporteFinal from './vistas/documentos/ReporteFinal';

function App() {
  return (
    <Router>
      <Route exact path="/" component={PaginaPrincipal} />
      <Route exact path="/servicio/formulario" component={formularioServicio} />
      <Route exact path="/usuario/iniciar-sesion" component={Sesion} />

      {/* Reportes */}
      <Route exact path="/reportes-parciales/:numero" component={DocumentoReporteParcial} />
      <Route exact path="/reporte-final" component={DocumentoReporteFinal} />

      {/* Formularios */}
      <Route exact path="/reportes-parciales/:numero/formulario" component={ReportesParciales} />
      <Route exact path="/reporte-final-2/formulario" component={ReporteFinal2} />
    </Router>
  );
}

export default App;

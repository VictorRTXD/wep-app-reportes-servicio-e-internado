import React from 'react';
import './global.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PaginaPrincipal from './vistas/PaginaPrincipal/index';
import CrearServicio from './vistas/CrearServicio';
import ReportesParciales from './vistas/formulariosDeReporte/ReporteParcial';
import ReporteFinal from './vistas/formulariosDeReporte/ReporteFinal';
import ReporteFinal2 from './vistas/formulariosDeReporte/ReporteFinal2';

// Documentos
import DocumentoReporteParcial from './vistas/documentos/ReporteParcial';
import DocumentoReporteFinal from './vistas/documentos/ReporteFinal';
import DocumentoReporteFinal2 from './vistas/documentos/ReporteFinal2';

function App() {
  return (
    <Router>
      <Route exact path="/" component={PaginaPrincipal} />
      <Route exact path="/servicio/crear" component={CrearServicio} />

      {/* Reportes */}
      <Route exact path="/reportes-parciales/:numero" component={DocumentoReporteParcial} />
      <Route exact path="/reporte-final" component={DocumentoReporteFinal} />
      <Route exact path="/reporte-final-2" component={DocumentoReporteFinal2} />

      {/* Formularios */}
      <Route exact path="/reportes-parciales/:numero/formulario" component={ReportesParciales} />
      <Route exact path="/reporte-final/formulario" component={ReporteFinal} />
      <Route exact path="/reporte-final-2/formulario" component={ReporteFinal2} />
    </Router>
  );
}

export default App;

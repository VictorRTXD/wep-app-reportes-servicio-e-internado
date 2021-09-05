import React from 'react';
import './global.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PaginaPrincipal from './vistas/PaginaPrincipal/index';
import CrearServicio from './vistas/CrearServicio';
import ReportesParciales from './vistas/ReportesParciales';
import ReporteParcial from './documentos/ReporteParcial';

function App() {
  return (
    <Router>
      <Route exact path="/" component={PaginaPrincipal} />
      <Route exact path="/servicio/crear" component={CrearServicio} />
      <Route exact path="/reportes-parciales/:numero" component={ReportesParciales} />
      <Route exact path="/reportes-parciales/:numero/documento" component={ReporteParcial} />
    </Router>
  );
}

export default App;

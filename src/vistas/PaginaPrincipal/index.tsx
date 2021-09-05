import React from 'react';
import { Redirect } from 'react-router-dom';
import BarraNavegacion from '../../componentes/BarraNavegacion';
import '../../global.css';

export default function PaginaPrincipal() {
  const servicioExiste = true;

  if (!servicioExiste) {
    return (
      <Redirect to="/servicio/crear" />
    );
  }

  return (
    <BarraNavegacion />
  );
}

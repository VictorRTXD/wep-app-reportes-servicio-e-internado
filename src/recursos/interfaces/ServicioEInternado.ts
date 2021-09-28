/* Interfaz de Servicio e Internado
 * Escrito por Ramón Paredes Sánchez.
 */

interface ServicioEInternado {
  id: number;
  idUsuario: number;
  entidadReceptora: string;
  receptor: string;
  programa: string;
  objetivosDelPrograma: string;
  fechaInicio: string;
  fechaFin: string;
  totalDeHoras: number;
  horarioHoraInicio: string;
  horarioHoraFin: string;
}

export default ServicioEInternado;

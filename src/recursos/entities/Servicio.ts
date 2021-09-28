/* Entidad de Servicio.
 * Esta entidad incluye la información necesaria para la creación de
 * un objeto tipo Servicio con todos los valores de todas las tablas,
 * a excepción de usuarios y trimestres. Incluye las interfaces de cada
 * una de las tablas necesarias.
 *
 * Escrito por Ramón Paredes Sánchez.
 */

/** Import's de todas las interfaces necesarias para la construcción de la entidad.
 */
import ReporteParcial from '../interfaces/ReporteParcial';
import ReporteFinalDos from '../interfaces/ReporteFinalDos';
import ActividadesDeUsuario from '../interfaces/ActividadesDeUsuario';

/** Entidad de Servicio. Contiene toda la información e interfaces que conforman
 * un servicio social o internado.
 */
export default class Servicio {
  private id: number;

  private idUsuario: number;

  private entidadReceptora: string;

  private receptor: string;

  private programa: string; // Puede no ser necesario.

  private objetivosDelPrograma: string; // Puede no ser necesario

  private fechaInicio: string; // En la BD es tipo DATE pero se puede interpretar como string.

  private fechaFin: string;

  private totalDeHoras: number;

  private horarioHoraInicio: string; // Mismo caso que las fechas.

  private horarioHoraFin: string;

  private reportesParciales: ReporteParcial[];

  private reporteFinalDos: ReporteFinalDos;

  private actividadesDeUsuario: ActividadesDeUsuario[];

  constructor(
    id: number,
    idUsuario: number,
    entidadReceptora: string,
    receptor: string,
    programa: string,
    objetivosDelPrograma: string,
    fechaInicio: string,
    fechaFin: string,
    totalDeHoras: number,
    horarioHoraInicio: string,
    horarioHoraFin: string,
    parciales: ReporteParcial[],
    final: ReporteFinalDos,
    actividades: ActividadesDeUsuario[],
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.entidadReceptora = entidadReceptora;
    this.receptor = receptor;
    this.programa = programa;
    this.objetivosDelPrograma = objetivosDelPrograma;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.totalDeHoras = totalDeHoras;
    this.horarioHoraInicio = horarioHoraInicio;
    this.horarioHoraFin = horarioHoraFin;
    this.reportesParciales = parciales;
    this.reporteFinalDos = final;
    this.actividadesDeUsuario = actividades;
  }

  // sets y gets de todas las interfaces y propiedades de la clase

  public setId(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public setidUsuario(idUsuario: number) {
    this.idUsuario = idUsuario;
  }

  public getIdUsuario(): number {
    return this.idUsuario;
  }

  public setEntidadReceptora(entidadReceptora: string) {
    this.entidadReceptora = entidadReceptora;
  }

  public getEntidadReceptora(): string {
    return this.entidadReceptora;
  }

  public setReceptor(receptor: string) {
    this.receptor = receptor;
  }

  public getReceptor(): string {
    return this.receptor;
  }

  public setPrograma(programa: string) {
    this.programa = programa;
  }

  public getPrograma(): string {
    return this.programa;
  }

  public setObjetivosDelPrograma(objetivosDelPrograma: string) {
    this.objetivosDelPrograma = objetivosDelPrograma;
  }

  public getObjetivosDelPrograma(): string {
    return this.objetivosDelPrograma;
  }

  public setFechaInicio(fechaInicio: string) {
    this.fechaInicio = fechaInicio;
  }

  public getFechaInicio(): string {
    return this.fechaInicio;
  }

  public setFechaFin(fechaFin: string) {
    this.fechaFin = fechaFin;
  }

  public getFechaFin(): string {
    return this.fechaFin;
  }

  public setTotalDeHoras(totalDeHoras: number) {
    this.totalDeHoras = totalDeHoras;
  }

  public getTotalDeHoras(): number {
    return this.totalDeHoras;
  }

  public setHorarioHoraInicio(horarioHoraInicio: string) {
    this.horarioHoraInicio = horarioHoraInicio;
  }

  public getHorarioHoraInicio(): string {
    return this.horarioHoraInicio;
  }

  public setHorarioHoraFin(horarioHoraFin: string) {
    this.horarioHoraFin = horarioHoraFin;
  }

  public getHorarioHoraFin(): string {
    return this.horarioHoraFin;
  }

  public setReportesParciales(parciales: ReporteParcial[]): void {
    this.reportesParciales = parciales;
  }

  public getReportesParciales(): ReporteParcial[] {
    return this.reportesParciales;
  }

  public setReporteFinalDos(final: ReporteFinalDos): void {
    this.reporteFinalDos = final;
  }

  public getReporteFinalDos(): ReporteFinalDos {
    return this.reporteFinalDos;
  }

  public setActividadesDeUsuario(actividades: ActividadesDeUsuario[]):void {
    this.actividadesDeUsuario = actividades;
  }

  public getActividadesDeUsuario(): ActividadesDeUsuario[] {
    return this.actividadesDeUsuario;
  }
}

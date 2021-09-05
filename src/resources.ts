export type roles = 'prestador' | 'interno' | 'revisor' | 'administrador';

export interface Usuario {
  id: number
  rol: roles
}

export interface ActividadesDeUsuario {
  id: number;
  idServicio: number;
  descripcion: string;
}

export interface ActividadesRealizadas {
  id: number;
  idActividad: number;
  idReporteParcial: number;
  cantidad: number;
}

export interface AtencionesRealizadas {
  id: number;
  idReporteParcial: number;
  idUsuario: number;
  tipo: number;
  cantidad: number;
}

export interface ReporteFinalDos {
  id?: number;
  idServicio: number;
  metaAlcanzada: string;
  metodologiaUtilizada: string;
  innovacionAportada: string;
  conclusiones: string;
  propuestas: string;
  actividadesRealizadas: ActividadesRealizadas[];
  atencionesRealizadas: AtencionesRealizadas[];
}

export interface ReporteParcial {
  id?: number;
  idServicio: number;
  idTrimestre: number;
  actualizado: string;
  actividadesRealizadas: ActividadesRealizadas[];
  atencionesRealizadas: AtencionesRealizadas[];
}

export interface ServicioEInternado {
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

export interface Trimestre {
  id?: number;
  fechaInicio: any;
  fechaFin: any;
}

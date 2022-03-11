export default function obtenerCarrerra(abreviacion: string): string {
  switch (abreviacion) {
    case 'NUT':
      return 'Licenciatura en Nutrición';
    case 'LNTO':
      return 'Licenciatura en Nutrición';
    case 'ENFA':
      return 'Licenciatura en enfermería';
    case 'NUTA':
      return 'Licenciatura en Nutrición';
    case 'DENA':
      return 'Licenciatura en Cirujano Dentista';
    case 'MCPA':
      return 'Licenciatura Médico Cirujano y Partero';
    case 'MCP':
      return 'Licenciatura Médico Cirujano y Partero';
    case 'LENF':
      return 'Licenciatura en Enfermería';
    case 'ENF':
      return 'Licenciatura en enfermería';
    case 'LICD':
      return 'Licenciatura en Cirujano Dentista';
    case 'DEN':
      return 'Licenciatura en Cirujano Dentista';
    case 'MIDU':
      return 'Maestría en Salud Pública';
    default:
      return abreviacion;
  }
}

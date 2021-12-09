export default function obtenerCarrerra(abreviacion: string): string {
  switch (abreviacion) {
    case 'ENFA':
      return 'LIC EN ENFERMERIA';
    case 'NUTA':
      return 'LIC EN NUTRICION';
    case 'DENA':
      return 'LIC EN CIRUJANO DENTISTA';
    case 'MCPA':
      return 'LIC MEDICO CIRUJANO Y PARTERO';
    case 'MCPE':
      return 'MEDICO CIRUJANO Y PARTERO';
    case 'LENF':
      return 'LICENCIATURA EN ENFERMERIA';
    case 'LICD':
      return 'LIC. EN CIRUJANO DENTISTA';
    case 'EODP':
      return 'ESPECIALIDAD EN ODONTOPEDIATRIA';
    case 'EMFM':
      return 'ESP. EN MEDICINA FAMILIAR';
    case 'EMUR':
      return 'ESP.EN MEDICINA DE URGENCIAS';
    case 'ENDO':
      return 'ESP EN ENDODONCIA';
    case 'MIDU':
      return 'MAE EN CS DE LA SAL PUB OR EDU';
    case 'ESEN':
      return 'ESP.EN ENDODONCIA';
    default:
      return '';
  }
}

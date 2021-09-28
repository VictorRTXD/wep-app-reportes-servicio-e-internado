/* eslint-disable linebreak-style */
type roles = 'prestador' | 'interno' | 'revisor' | 'administrador';

export default class Usuario {
    id: number;

    rol: roles;

    constructor(id: number, rol: roles) {
      this.id = id;
      this.rol = rol;
    }

    setId(id: number): void {
      this.id = id;
    }

    setRol(rol: roles): void {
      this.rol = rol;
    }

    getId(): number {
      return this.id;
    }

    getRol(): roles {
      return this.rol;
    }

    serialize():any {
      return {
        id: this.id,
        rol: this.rol,
      };
    }
}

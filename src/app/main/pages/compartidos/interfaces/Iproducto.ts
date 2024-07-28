export interface Iproducto {
    codigo?: number;
    codModulo?: number;
    codCategoria?: number;
    descripcion?: string;
    grupo?: string;
    codigoProducto?: string;
    codigoBarras?: string;
    precioCosto?: number;
    medida?: string;
    precioCompra?: number;
    precioMayoreo?: number;
    numExistenciaActual?: number;
    numExistenciaMinima?: number;
    fechaRegistra?: string;
    estado?: string;

    modulo: any;
    categoria: any;
}
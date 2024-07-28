import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cliente } from 'app/main/pages/compartidos/modelos/Cliente';
import { MensajesIziToastService } from 'app/main/pages/compartidos/servicios/iziToast/mensajesIziToast.service';
import { MensajeService } from 'app/main/pages/compartidos/servicios/mensaje/mensaje.service';
import { DetailComponent } from 'app/main/pages/venta/cliente/componentes/detail/detail.component';
import { ClienteService } from '../../../servicios/cliente.service';
import dayjs from "dayjs";
import { MyValidators } from 'app/utils/validators';
import { Persona } from 'app/main/pages/compartidos/modelos/Persona';
import { PersonaService } from 'app/main/pages/catalogo/persona/servicios/persona.service';
import { PrefijoTelefonico } from 'app/main/pages/compartidos/modelos/PrefijoTelefonico';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent implements OnInit {
  /*SPINNER*/
  public load_btn: boolean;

  /*OUTPUT ENVIAN*/
  @Output() close: EventEmitter<boolean>;
  @Output() listaCliente: EventEmitter<any>;

  /*INPUT RECIBEN*/
  @Input() listaClienteChild: any;
  @Input() clienteEditar: Cliente;
  @Input() codigoChild: number;
  @Input() identificacionChild: string;

  /*MODALES*/
  @ViewChild("modal_success", { static: false }) modal_success: TemplateRef<any>;
  @ViewChild("modal_error", { static: false }) modal_error: TemplateRef<any>;
  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;

  /*VARIABLES */
  public showDetail: boolean;
  private amieRegex: string;
  private currentUser: any;

  /*FORMULARIOS*/
  public formCliente: FormGroup;

  /*OBJETOS*/
  public cliente: Cliente;
  public persona: Persona;
  public listaPersona: Persona[];
  public listaPrefijoTelefonico: PrefijoTelefonico[];
  public listaRespuesta = [
    { valor: "SI" },
    { valor: "NO" },
  ];

  /*CONSTRUCTOR*/
  constructor(
    private clienteService: ClienteService,
    private personaService: PersonaService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private mensajeIzi: MensajesIziToastService,
  ) {
    this.load_btn = false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //this.sede = this.currentUser.sede;
    //this.amieRegex = this.patternAmie(this.sede.nombre);
    this.close = new EventEmitter<boolean>();
    this.listaCliente = new EventEmitter<any>();
    this.showDetail = true;
  }

  ngOnInit() {
    if (this.clienteEditar) {
      this.formCliente = this.formBuilder.group({
        identificacion: new FormControl({ value: this.clienteEditar?.identificacion, disabled: true }, Validators.required),
        /*
        identificacion: new FormControl({ value: this.clienteEditar.identificacion, disabled: true }, Validators.compose([
          MyValidators.isCedulaValid,
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("^[0-9]*$"),
        ])),
        */
        nombres: new FormControl(this.clienteEditar?.nombres, Validators.required),
        apellidos: new FormControl(this.clienteEditar?.apellidos, Validators.required),
        fechaNacimiento: new FormControl(dayjs(this.clienteEditar?.fechaNacimiento).format("YYYY-MM-DD")),
        direccion: new FormControl(this.clienteEditar?.direccion),
        codigo: new FormControl(this.clienteEditar?.prefijoTelefonico, Validators.required),
        celular: new FormControl(this.clienteEditar?.celular),
        correo: new FormControl(this.clienteEditar?.correo),
        fechaInicio: new FormControl(dayjs(this.clienteEditar?.fechaInicio).format("YYYY-MM-DD")),
        tipoCliente: new FormControl(this.clienteEditar?.tipoCliente),
      })
      //AQUI TERMINA ACTUALIZAR
    } else {
      this.formCliente = this.formBuilder.group({
        identificacion: new FormControl({ value: this.identificacionChild, disabled: false }, Validators.required),
        /*
        identificacion: new FormControl({ value: this.identificacionChild, disabled: false }, Validators.compose([
          MyValidators.isCedulaValid,
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("^[0-9]*$"),
        ])),
        */
        nombres: new FormControl('', Validators.required),
        apellidos: new FormControl('', Validators.required),
        fechaNacimiento: new FormControl(''),
        direccion: new FormControl(''),
        codigo: new FormControl('593', Validators.required),
        celular: new FormControl(''),
        correo: new FormControl(''),
        fechaInicio: new FormControl(dayjs(new Date()).format("YYYY-MM-DD")),
        tipoCliente: new FormControl(''),
      })
    }
    this.listarPrefijoTelefonico();
  }
  
  async listarPrefijoTelefonico() {
    this.clienteService.listarPrefijoTelefonico().subscribe(
      (respuesta) => {
        this.listaPrefijoTelefonico = respuesta['listado'];
      }
    );
  }

  buscarPrefijoTelefonico() {
    // Receptar el codigo de formCliente.value
    let formClienteTemp = this.formCliente.value;
  }

  listarClientePorIdentificacion() {
    this.personaService.listarPersonaPorIdentificacion(this.identificacionChild).subscribe(
      (respuesta) => {
        this.listaClienteChild = respuesta['listado']
        //this.listaCliente.emit(this.listaClienteChild);
        for (const ele of this.listaClienteChild) {
          ele.fechaInicio = dayjs(ele?.fechaInicio).format("YYYY-MM-DD")
          ele.fechaInicio = dayjs(ele.fechaInicio).format("YYYY-MM-DD")
          if (ele?.prefijoTelefonico == null || ele?.prefijoTelefonico == "") {
            ele.prefijoTelefonico = '593';
          }
          /*
          ele.fechaNacimiento = dayjs(ele.fechaNacimiento).format("YYYY-MM-DD")
          if (ele.codigo != null) {
            this.clienteService.listarClientePorPersona(ele.codigo).subscribe(
              (respuesta) => {
                this.listaCliente = respuesta['listado'];
                ele.cliente = this.listaCliente[0];
                ele.cliente.fechaInicio = dayjs(ele.cliente.fechaInicio).format("YYYY-MM-DD")
              }
            )
          }
          */
        }
        this.listaCliente.emit(this.listaClienteChild);
      }
    );
  }
  
  async listarClienteActivoOrdenNombre() {
    this.clienteService.listarClienteActivoOrdenNombre().subscribe(
      (respuesta) => {
        this.listaClienteChild = respuesta['listado'];
        for (const ele of this.listaClienteChild) {
          ele.fechaInicio = dayjs(ele.fechaInicio).format("YYYY-MM-DD")
          if (ele?.prefijoTelefonico == null || ele?.prefijoTelefonico == "") {
            ele.prefijoTelefonico = '593';
          }
        }
        this.listaCliente.emit(this.listaClienteChild);
        /*
        for (const ele of this.listaClienteChild) {
          ele.fechaInicio = dayjs(ele?.fechaInicio).format("YYYY-MM-DD")
          if (ele.codPersona != null) {
            ele.fechaInicio = dayjs(ele.fechaInicio).format("YYYY-MM-DD")
            this.personaService.buscarPersonaPorCodigo(ele.codPersona).subscribe(
              (respuesta) => {
                ele.persona = respuesta['objeto'];                                                            
                if (ele?.persona != undefined) {
                  ele.persona.fechaNacimiento = dayjs(ele.persona.fechaNacimiento).format("YYYY-MM-DD")
                }
              }
            )
          }
          
        }
        */
        //this.listaCliente.emit(this.listaClienteChild);
      }
    );
  }

  verificarPersona() {
    // Receptar la identificación de formInscripcionCedula.value
    let clienteIdentificacionTemp = this.formCliente.value;
    this.identificacionChild = clienteIdentificacionTemp.identificacion;
    this.personaService.listarPersonaPorIdentificacion(this.identificacionChild).subscribe({
      next: (response) => {
        this.listaPersona = response['listado'];
        this.persona = this.listaPersona['0'];
        if (this.persona?.codigo != null) {
          this.formCliente.controls.fechaNacimiento.setValue(dayjs(this.persona?.fechaNacimiento).format("YYYY-MM-DD"));
          this.formCliente.controls.nombres.setValue(this.persona?.nombres);
          this.formCliente.controls.apellidos.setValue(this.persona?.apellidos);
          this.formCliente.controls.direccion.setValue(this.persona?.direccion);
          this.formCliente.controls.correo.setValue(this.persona?.correo);
          this.formCliente.controls.celular.setValue(this.persona?.celular);

          this.clienteService.listarClientePorPersona(this.persona?.codigo).subscribe(
            (respuesta) => {
              this.listaCliente = respuesta['listado'];
              this.persona.cliente = this.listaCliente[0];
              if (this.persona.cliente != undefined) {
                this.persona.cliente.fechaInicio = dayjs(this.persona.cliente.fechaInicio).format("YYYY-MM-DD");
                this.formCliente.controls.fechaInicio.setValue(dayjs(this.persona.cliente?.fechaInicio).format("YYYY-MM-DD"));
                this.formCliente.controls.tipoCliente.setValue(this.persona.cliente?.tipoCliente);
                this.clienteEditar.persona = this.persona;
              }
            }
          )
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  patternAmie(amie: string) {
    const valorEncontrar = amie
    const regExp = new RegExp('([0-9])\\w+')
    const amieFiltrado = valorEncontrar.match(regExp)
    return amieFiltrado['0']
  }

  addRegistroPersona() {
    let fechaNacimiento = "";
    if (this.formCliente?.valid) {
      let formClienteTemp = this.formCliente.value;
      if (formClienteTemp?.fechaNacimiento.length != 0 && formClienteTemp?.fechaNacimiento.length != 12) {
        fechaNacimiento = dayjs(formClienteTemp?.fechaNacimiento).format("YYYY-MM-DD HH:mm:ss.SSS");
      }
      this.persona = new Persona({
        codigo: 0,
        identificacion: formClienteTemp?.identificacion,
        nombres: formClienteTemp?.nombres,
        apellidos: formClienteTemp?.apellidos,
        fechaNacimiento: fechaNacimiento,
        direccion: formClienteTemp?.direccion,
        prefijoTelefonico: formClienteTemp?.codigo,
        celular: formClienteTemp?.celular,
        correo: formClienteTemp?.correo,
        estado: 'A',
      });
    }
    if (this.clienteEditar) {
      this.persona['data'].codigo = this.clienteEditar?.codPersona;
      this.persona['data'].identificacion = this.identificacionChild;
      this.personaService.guardarPersona(this.persona['data']).subscribe({
        next: (response) => {
          // Actualizar Datos Cliente
          this.addRegistroCliente();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Ha habido un problema al actualizar el registro...');
          this.parentDetail.closeDetail();
        }
      });
    } else {
      this.personaService.guardarPersona(this.persona['data']).subscribe({
        next: async (response) => {
          this.persona = response['objeto'];
          // Actualizar Datos Cliente
          this.addRegistroCliente();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Ha habido un problema al agregar el registro...');
          this.parentDetail.closeDetail();
        }
      });
    }
  }

  addRegistroCliente() {
    if (this.formCliente?.valid) {
      let formClienteTemp = this.formCliente.value;
      this.cliente = new Cliente({
        codigo: 0,
        codPersona: this.persona?.codigo,
        tipoCliente: formClienteTemp.tipoCliente,
        fechaInicio: dayjs(formClienteTemp.fechaInicio).format("YYYY-MM-DD HH:mm:ss.SSS"),
        estado: 'A',
      });
    }
    if (this.clienteEditar) {
      this.cliente['data'].codigo = this.clienteEditar?.codigo;
      this.clienteService.guardarCliente(this.cliente['data']).subscribe({
        next: (response) => {
          this.listarClienteActivoOrdenNombre();
          this.mensajeService.mensajeCorrecto('Se ha actualizado el registro correctamente...');
          this.parentDetail.closeDetail();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Ha habido un problema al actualizar el registro...');
          this.parentDetail.closeDetail();
        }
      });
    } else {
      this.clienteService.guardarCliente(this.cliente['data']).subscribe({
        next: async (response) => {
          this.listarClienteActivoOrdenNombre();
          this.mensajeService.mensajeCorrecto('Se ha agregado el registro correctamente...');
          this.parentDetail.closeDetail();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Ha habido un problema al agregar el registro...');
          this.parentDetail.closeDetail();
        }
      });
    }
  }

  closeDetail($event) {
    this.close.emit($event);
  }

  compararPrefijoTelefonico(o1, o2) {
    return o1 === undefined || o2 === undefined || o2 === null ? false : o1.codigo === o2.codigo;
  }

  // Contar los caracteres de la cedula para activar boton <Buscar>
  onKey(event) {
    if (event.target.value.length != 10) {
      this.resetTheForm();
    } else {
      this.verificarPersona();
    }
  }

  resetTheForm(): void {
    this.formCliente.reset = null;
  }

  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }

    const regex = /[0-9]/;

    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  get identificacionField() {
    return this.formCliente.get('identificacion');
  }
  get nombresField() {
    return this.formCliente.get('nombres');
  }
  get apellidosField() {
    return this.formCliente.get('apellidos');
  }
  get fechaNacimientoField() {
    return this.formCliente.get('fechaNacimiento');
  }
  get direccionField() {
    return this.formCliente.get('direccion');
  }
  get celularField() {
    return this.formCliente.get('celular');
  }
  get correoField() {
    return this.formCliente.get('correo');
  }
  get tipoClienteField() {
    return this.formCliente.get('tipoCliente');
  }
  get fechaInicioField() {
    return this.formCliente.get('fechaInicio');
  }
  get codigoField() {
    return this.formCliente.get('codigo');
  }
}

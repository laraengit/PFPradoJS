//Funciones

function menu (nombre, seccion,opciones, cantOpciones){
    //No usar 0 (no toma el caso en el switch), siempre ingresar las opciones de 1 hasta n = cantOciones 
    let elecc
    do {
        elecc= Number(prompt(`${seccion}\n${nombre}, presioná en tu teclado el número correspondiente a lo que querés hacer: \n${opciones} `))
        console.log(`El usuario ingresó ${elecc}`)
    }while(elecc>cantOpciones || elecc<=0 ||  !Number(elecc))
    return elecc
}

function menuPrincipal (nombre){
    let eleccPrinc
    let elecc2 = 1
    
    do{
        eleccPrinc = menu(nombre,"Menú principal", "1. Pedir un turno \n2.Calcular mi Índice de masa corporal (IMC) \n3.Chequear mis valores de presión\n4.Consulta Servicios \n5. Salir",5)
        switch(eleccPrinc){
            case 1:
                console.log(" caso 1. Pedir un turno")
                let noesp
                noesp = pedirTurno(nombre)
                if (noesp == 1){
                    //si no estaba la especialidad, la redirigimos directamente al menu principal
                    elecc2 = 1
                }else{
                    //si habia la especialidad le presguntamos tambien si quiere  salir
                    elecc2 = menu(nombre,"Qué hacemos?","1.Volver al Menú principal \n2. Salir",2)
                }
                
                break
            case 2:
                console.log("caso 2.Calcular mi Índice de masa corporal(IMC)")
                imc(nombre)
                elecc2 = menu(nombre,"Qué hacemos?","1.Volver al Menú principal \n2. Salir",2)
                break
            case 3:
                console.log("caso 3.Chequear mis valores de presión")
                presion(nombre)
                elecc2 = menu(nombre,"Qué hacemos?","1.Volver al Menú principal \n2. Salir",2)
                break
            case 4:
                console.log("caso 4.Consulta servicios")
                consultaServicios(nombre, serviciosDisponibles,especialidades)
                elecc2 = menu(nombre,"Qué hacemos?","1.Volver al Menú principal \n2. Salir",2)
                break
            default:
                salir(nombre)
                break
        }
    } while(elecc2!=2 && eleccPrinc != 5 )
    if (eleccPrinc!=5){
        //Si eligio 4 en el menu principal, ya la despidieron antes. Hago un caso aparte solo si se quisieron ir luego de haber realizado 1,2 o 3
        salir(nombre)
    }
}

function imc(peso,altura){
    console.log(peso)
    console.log(altura)
    let imc = peso/(altura**2)
    console.log(imc)
    return imc
    
}

function presion(sist,diast){
    
    //veo en donde cae
    let resultado = `Los valores de presión ingresados son correspondientes a `

    if (sist>=180 || diast>=120){
        resultado = resultado + "una Hipertensión de Grado 3. Solicite atención médica."
    }else if ((sist>=160 && diast <120)  || (diast>=100 && sist<180)){
        resultado = resultado + "una Hipertensión de Grado 2. Solicite atención médica."
    }
    else if ((sist>=130 && diast <100) || (diast>=80 && sist<160)){
        resultado = resultado + "una Hipertensión de Grado 1. Agende un control médico."
    }
    else if ((sist>=120 && diast <80) ){
        resultado = resultado + "una Prehipertensión. Agende un control médico."
    }
    else if ((sist>=90 && diast <80) || (diast>=60 && sist<120)){
        resultado = resultado + "tensión normal."
    }
    else {
        resultado = resultado + "tensión baja. Solicite atención médica. "
    }
    return resultado
}


function pedirTurno(nombre){
    let nuevo
    let prepaga
    let prepagaNombre
    let especialidad
    let disponibilidad
    let noespec = 2
    //Primero le pedimos la especialidad, para no hacerle perder tiempo si esta lo que busca
    especialidad = menu(nombre,"Consulta turnos: Especialidad", "1. Ginecología\n2.Oftalmología\n3.Cardiología\n4.Clínica\n5.Dermatología\n6.Otra",6)
    if (especialidad==6){
        //Caso no atienden esa especialidad: le avisamos y lo redirigimos
        alert("Lo lamentamos, solo contamos con las especialidades listadas")
        noespec = 1
    }
    else{
        //Si atienden le pedimos los datos
        disponibilidad = menu(nombre, "Consulta turnos: Disponibilidad horaria \n Atendemos días de semana de 8 a 20 hs", "1. Mañana\n 2. Tarde \n 3. Mañana y tarde",3)
        nuevo = menu(nombre,"Consulta turnos", "1. Soy un paciente nuevo en el consultorio\n 2.Ya me atendí en el consultorio",2)
        if(nuevo == 1){
            let datosOK = 2
            do{
                //si es nuevo hay que pedirle mas datos
                let apellido = prompt("Ingresá tu apellido")
                let celular = prompt("Ingresá tu celular sin espacios")
                prepaga = menu(nombre,"Consulta turnos: prepaga/Obra Social", "1. Swiss Medical\n2. OSDE\n3. Galeno\n4. Medicus\n5. No tengo/Otra",5)
                //const prepagasAceptadas = ["Swiss Medical","OSDE","Galeno","Medicus"]
                if (prepaga <= 4){
                    alert("La atención está cubierta por tu prepaga")
                    prepagaNombre = prepagasAceptadas[prepaga-1]
                }else{
                    alert("La atención no está cubierta por tu prepaga. Te agendaremos como privado.")
                    prepagaNombre = "Privado"
                }
                let dni = prompt("Ingresá tu DNI sin puntos ni comas")
                const paciente = new PacienteNuevo(nombre,apellido,dni,celular,prepagaNombre)
                
                paciente.mostrarInfoPaciente()

                datosOK = menu(nombre,"Confirmación datos ingresados", "1. Mis datos estaban ok\n2. Quiero corregir mis datos",2)
            }while(datosOK!=1)
            
        }
        //si no es nuevo, ya con el dni del paciente deberian rastrear el resto de los datos de contacto
        //let dni = prompt("Ingresá tu DNI sin puntos ni comas")

        alert("Listo! Quedó registrada tu consulta por el turno. Nos vamos a comunicar para enviarte los turnos disponibles.")
    }
    

    return noespec

}

function consultaServicios(servicios,especialidades,especBusq){
    //Buscador de servicios del consultorio
    let servFiltrados
    let indEspec = (especBusq - 1)
    //Filtro
    if (indEspec!=5){
        servFiltrados = servicios.filter((serv)=>((serv.especialidad == especialidades[indEspec])) || (serv.especialidad == "Todas"))
    } else{
        servFiltrados = servicios
    }
    
    return servFiltrados
}

function salir(nombre){
    alert(`¡Gracias por visitarnos ${nombre}!`)
}

//DOM
//CAPTURA DOM
let containerServicios = document.getElementById("servicios")
let filtroServicios = document.getElementById("selectFiltrar")
let btnPresion = document.getElementById("btnPresion")
let presionSis = document.getElementById("idPrS")
let presionDias = document.getElementById("idPrD")
let btnimc = document.getElementById("btnIMC")
let peso = document.getElementById("idPeso")
let altura = document.getElementById("idAltura")
let resultPresion = document.getElementById("resultPresion")
let resultIMC = document.getElementById("resultIMC")
//Turnos
let btnIngresado = document.getElementById("btnIngresado")
let btnNuevo = document.getElementById("btnNuevo")
let infoPaciente = document.getElementById("divInfoPaciente")
let servAgregado = document.getElementById("servAgregados")
let precioServ = document.getElementById("precioServ")
let divSolTurno = document.getElementById("divSolTurno")



//Función DOM
function mostrarCatalogoDOM(array){
    //resetear el container
    containerServicios.innerHTML = ""
    //for of: para recorrer un array posición a posición
    for(let serv of array){
        
        let servicioNuevo= document.createElement("div")
        servicioNuevo.className = "col-12 col-md-6 col-lg-4 my-2"
        servicioNuevo.innerHTML = `
            <div id="${serv.id}" class="card mb-3" style="width: 100%;height: 100%;">
                <div class="row no-gutters">
                    <div class="col-md-6">
                        <img class="card-img img-fluid" style="height: auto;  "src="images/${serv.imagen}" alt="${serv.servicio} de ${serv.especialidad} ">
                        
                    </div>
                
                    <div class="col-md-6">
                        <div class="card-body">
                            <h4 class="card-title">${serv.servicio}</h4>
                            <p>${serv.especialidad}</p>
                            <p>${serv.descripcion}</p>
                            <p>Precio: $ ${serv.precio}</p>
                        </div>
                        
                    </div>
                </div>
                <button id="btnAgregar${serv.servicio}" class="btn btn-secondary mx-5 bottom">Seleccionar</button>
                
 
        </div> `

        containerServicios.append(servicioNuevo)

        let agregarBtn = document.getElementById(`btnAgregar${serv.servicio}`)
        console.log(agregarBtn)
        agregarBtn.addEventListener("click", () => {
            arrServSeleccionados.push(serv)
            mostrarServSelecc(arrServSeleccionados)
            let total = arrServSeleccionados.reduce((acc,elem) => acc + elem.precio, 0)
            precioServ.innerHTML = `Total: ${total}`

        })
    }
}

function mostrarServSelecc(array){
    //resetear el container
    servAgregado.innerHTML = ""
    //for of: para recorrer un array posición a posición
    for(let serv of array){
        
        let servicioNuevo= document.createElement("div")
        servicioNuevo.className = ""
        servicioNuevo.innerHTML = `
            <div id="${serv.id}" class="card" style="width: 100%;">
                
                    
                <div class="card-body">
                    <h4 class="card-title">${serv.servicio}</h4>
                    <p>Precio: $ ${serv.precio}</p>
                </div>
                
        </div> `

        servAgregado.append(servicioNuevo)

    }

}

//Filtrar por especialidad
filtroServicios.addEventListener("change", () => {
    // console.log("Detecto cambio")
    console.log(filtroServicios.value)
    let servFiltrados = consultaServicios(serviciosDisponibles,especialidades,filtroServicios.value)
    mostrarCatalogoDOM(servFiltrados)
    
})

//Turnos
btnIngresado.addEventListener("click", () => {
    infoPaciente.innerHTML = `<form action="">
    <label for="DNI">DNI: </label>
    <input type="text" name="Nombre" id="nombre" required>
    <label for="">Disponibilidad:</label>
    <select name="" id="idAgenda" required>
        <option value="1">Mañana</option>
        <option value="2">Tarde</option>
        <option value="3">Indistinto</option>
    </select>
    <input type="submit" value="Solicitar Turno" class="btn-danger">

    
</form>`
    /* divSolTurno.innerHTML(`<button id="btnSolicitarTurno" class="btn btn-secondary mx-5 bottom">Solicitar turno</button>`)
    let btnSolicTurno = document.getElementById("btnSolicitarTurno")
    btnSolicTurno.addEventListener("click", () => {
        if(nombre){}

        }
    
     
    }) */
})

btnNuevo.addEventListener("click", () => {
    infoPaciente.innerHTML = `<form action="">
    <label for="Nombre">Nombre: </label>
    <input type="text" name="Nombre" id="">
    <label for="Nombre">Apellido: </label>
    <input type="text" name="Nombre" id="" required>
    <label for="DNI">DNI: </label>
    <input type="text" name="Nombre" id="" required>
    <label for="DNI">Celular: </label>
    <input type="text" name="Nombre" id="" required>
    <label for="">Disponibilidad:</label>
    <select name="" id="idAgenda" required>
        <option value="1">Mañana</option>
        <option value="2">Tarde</option>
        <option value="3">Indistinto</option>
    </select>
    <label for="">Selecioná tu prepaga:</label>
    <select name="prepaga" id="idPrepaga" required>
        <option value="1">Swiss Medical</option>
        <option value="2">OSDE</option>
        <option value="3">Galeno</option>
        <option value="4">Medicus</option>
        <option value="5">Otra/No tengo</option>
    </select>
    <div id="cubrePrepaga"></div>
    <input type="submit" value="Solicitar Turno" class="btn-danger">
    
    </form>`
    let cubrePrepaga = document.getElementById("cubrePrepaga")
    let prepagaSelect = document.getElementById("idPrepaga")
    prepagaSelect.addEventListener("change", () => {
        // console.log("Detecto cambio")
        console.log(prepagaSelect.value)
        if (prepagaSelect.value != 5){
            cubrePrepaga.innerText = "Tu prepaga cubre la atención médica en este consultorio"
        }else{
            cubrePrepaga.innerText = "Deberás ingresar como privado"
        }
    })
     
})



//Herramientas
//Presion
btnPresion.addEventListener("click", () => {
    let resultado
    
    console.log(presionSis.value)
    if((!parseFloat(presionSis.value))||(!parseFloat(presionDias.value))){
        alert("Debes ingresar valores numéricos")
        resultado = ""
    }else{
        resultado = presion(parseFloat(presionSis.value),parseFloat(presionDias.value))
        console.log(resultado)
        resultPresion.innerText = `${resultado}`
    }
     
})
//IMC
btnimc.addEventListener("click", () => {
    let resultadoimc
    if((!parseFloat(peso.value))||(!parseFloat(altura.value))){
        alert("Debes ingresar valores numéricos")
        resultadoimc = ""
    }else{
        resultadoimc = imc(parseFloat(peso.value),parseFloat(altura.value))
        console.log(resultadoimc)
        resultIMC.innerText = `Su IMC es: ${resultadoimc}`
    }
     
})



//DARKMODE
let btnToggle = document.getElementById("btnToggle")
console.log(btnToggle)
if(localStorage.getItem("modoOscuro")){
    //si existe la calve en el storage

}else{
    //no existe la clave en el storage
    console.log("SETEAMOS POR PRIMERA VEZ")
    localStorage.setItem("modoOscuro", false)
}

if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
    document.body.classList.toggle("darkMode")
    btnToggle.innerText = "Modo Claro"
}

//funcionamiento del botón
btnToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode")
    if(JSON.parse(localStorage.getItem("modoOscuro")) == false){
        //ACA VOY A MODO OSCURO
        btnToggle.innerText = "Modo claro"
        localStorage.setItem("modoOscuro", true)
    }
    else if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
        //VOY A MODO CLARO
        btnToggle.innerText = "Modo Oscuro"
        localStorage.setItem("modoOscuro", false)
    }
})

//Constructores y clases
class PacienteNuevo{
    constructor(nombre,apellido,dni,celular,prepaga) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.celular = celular;
        this.prepaga = prepaga;
    }

    mostrarInfoPaciente(){
        alert(`Estos son los datos registrados: \nNombre: ${this.nombre} \nApellido: ${this.apellido} \nDNI: ${this.dni} \nPrepaga: ${this.prepaga}\nCelular: ${this.celular}`)
    }

}

function Servicio(servicio,precio,descrip, especialidad,imagen) {
    this.servicio = servicio;
    this.precio = precio;
    this.descripcion = descrip;
    this.especialidad = especialidad;
    this.imagen = imagen

}
//Datos del sistema

const prepagasAceptadas = ["Swiss Medical","OSDE","Galeno","Medicus"]
const especialidades = ["Ginecología","Oftalmología","Cardiología","Clínica","Dermatología"]

const consulta = new Servicio("Consulta",7000,"Consulta con el especialista. Para chequeos de rutina o para consultar por sítnomas o cuadros específicos. ","Todas","consulta.jpg")
const revision = new Servicio("Revisión de estudios",5000,"Consulta para revisar estudios solicitados previamente y dar una devolución con un plan de acción","Todas","revisionEstudios.jpg")
const  pap = new Servicio("PAP",2000,"Papanicolau: para detectar cambios en las células del cuello uterino. Incluye la toma de muestras y el laboratorio. Lo reasliza un/a ginecólogo/a","Ginecología","pap.jpg")
const ecg = new Servicio("ECG",2000,"Electrocardiograma(ECG): Se estudia la actividad eléctrica del corazón. Lo realiza un/a cardiólogo/a o un técnico de ECG.","Cardiología","ecg.jpg")
const ergometria = new Servicio("Ergometría",5000,"Es una prueba de ejercicio físico donde se registra la actividad del corazón con electrodos bajo esfuerzo. Puede hacerse en bicicleta o en cinta. En nuestro consultorio se realiza en cinta.","Cardiología","ergometria.jpg")
const peeling = new Servicio("Peeling",10000,"Peeling: Tratamiento dermatológico que busca renovar la dermis a partir de una solución química que exfolia las capas externas de la piel.","Dermatología","peeling.jpeg")
const fondoOjos = new Servicio("Fondo de ojos",2000,"Permite observar la parte posterior del interior del ojo. Para ello se usan gotas que dilatan las pupilas y cuyo efecto dura unas horas. Se usa para prevenir o hacer el seguimiento de enfermedades.","Oftalmología","fondoOjos.jpg")

const serviciosDisponibles = [consulta,revision, pap, ecg, peeling, fondoOjos, ergometria]

const arrServSeleccionados = []


//Diálogo
/* let nombre
do{
    nombre = prompt("Bienvenido al sitio web del consultorio! Ingresá tu nombre para comenzar: ")

}while(nombre === null)
menuPrincipal(nombre)
 */
mostrarCatalogoDOM(serviciosDisponibles)
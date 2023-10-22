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



//DOM
//CAPTURA DOM
//ingreso
let modalIngreso = document.getElementById("modalIngreso")
//Servicios
let containerServicios = document.getElementById("servicios")
let filtroServicios = document.getElementById("selectFiltrar")
//Herramientas
let btnPresion = document.getElementById("btnPresion")
let presionSis = document.getElementById("idPrS")
let presionDias = document.getElementById("idPrD")
let btnimc = document.getElementById("btnIMC")
let peso = document.getElementById("idPeso")
let altura = document.getElementById("idAltura")
let resultPresion = document.getElementById("resultPresion")
let resultIMC = document.getElementById("resultIMC")
//Turnos
let divErrorIngreso = document.getElementById("divErrorIngreso")
let btnIngresado = document.getElementById("btnIngresado")
let btnNuevo = document.getElementById("btnNuevo")
let infoPaciente = document.getElementById("divInfoPaciente")
let consultaPaciente = document.getElementById("consultaPaciente")
let servAgregado = document.getElementById("servAgregados")
let botonSelecc = document.getElementById("botonSelecc")
let botonCubre = document.getElementById("botonCubre")
let precioServ = document.getElementById("precioServ")
let divSolTurno = document.getElementById("divSolTurno")
let ultConsulta = document.getElementById("ultConsulta")
let btnEnviarConsulta = document.getElementById("btnEnviarConsulta")
let btnConsulta = document.getElementById("btnConsulta")





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
        //RELACION CON TURNO
        //Acá armo el evento click del botón para agregar el servicio al pedido del turno (análogo de carrito)
        let agregarBtn = document.getElementById(`btnAgregar${serv.servicio}`)
        console.log(agregarBtn)
        agregarBtn.addEventListener("click", () => {
            if (ingresadoFlag){
                haySeleccion = true
                //Primero reviso si ya está seleccionado
                let yaSeleccionoServ = arrServSeleccionados.find((elem)=>(elem.servicio === serv.servicio)&&(elem.especialidad === serv.especialidad))
                //Si no fue seleccionado todavía, entonces sí lo agrego al array de serv seleccionados y actualizo el visor de seleccionados
                if (!yaSeleccionoServ){
                    arrServSeleccionados.push(serv)
                    //Aviso que se agrego a los seleccionados
                    Toastify({
                        text: `Servicio seleccionado: ${serv.servicio}`,
                        duration: 4500,
                        newWindow: true,
                        gravity: "top",
                        position: 'right',
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                        
                    }).showToast();
                    //Guardo en local storage
                    localStorage.setItem("servSelecc", JSON.stringify(arrServSeleccionados))
                    mostrarServSelecc(arrServSeleccionados)
                    /* let total = arrServSeleccionados.reduce((acc,elem) => acc + elem.precio, 0)
                    precioServ.innerHTML = `Total: ${total}` */
                    
                }else{
                    //Aviso que no se puede agregar dos veces lo mismo
                    
                    Toastify({
                        text: `El servicio ${serv.servicio} ya estaba seleccionado`,
                        duration: 4500,
                        newWindow: true,
                        gravity: "top",
                        position: 'right',
                        style: {
                            background: "linear-gradient(to right, #CD5C5C, #FFB6C1)",
                        },
                        
                    }).showToast();
                }

                }else{
                    Swal.fire({
                        icon: 'warning',
                        text: 'Antes de cargar tu sellección, debes ingresar con tus datos',
                      })
                }
            
            

        })
    }
}

function mostrarServSelecc(array){

    if(array.length != 0){
        //Reseteo lo que ya estaba
        servAgregado.innerHTML = ""
        //Me traigo los datos de la prepaga
        let dni = JSON.parse(sessionStorage.getItem("dni"))
        let datosPaciente = JSON.parse(localStorage.getItem(dni))
        let prep = parseInt(datosPaciente.prepaga)
        console.log(prep)
        fetch("prepagas.json")
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data)
                    let prepagas = data.map((el) =>el.nombre)
                    console.log(prepagas)
                    let prepaga = data.find((ele)=>ele.nombre === prepagas[prep-1])
                    console.log(prepaga)
                    let servCubiertos = prepaga.servicios
                    //Entro en el for para mostrar cada servicio
                    //Recorro todos los elementos (servicios seleccionados) de mi array
                    for(let serv of array){
                        let servicioNuevo= document.createElement("div")
                        //Solo me interesa mostrar el servicio, la especialidad y el precio: el resto de la info ya la tiene en catalogo
                        

                        if (prep != 5){
                            //Metodo fetch para verificar que cubre la prepaga del paciente
                            
                                let cubre = servCubiertos.some((el)=>el===serv.servicio)
                                !cubre ? servNoCubiertos.push(serv) : servSeleccCubierto.push(serv)
                                let infoCubre = cubre ? "Cubierto" : "No cubierto"
                                servicioNuevo.className = ""
                                servicioNuevo.innerHTML = `
                                    <div id="${serv.id}" class="card" style="width: 100%;">
                                        <div class="card-body">
                                            <h4 class="card-title">${serv.servicio}</h4>
                                            <p>${serv.especialidad}</p>
                                            <p>Precio: $ ${serv.precio} - ${infoCubre}</p>
                                        </div>
                                        
                                </div> `
                        }else{
                                let infoCubre =  "No cubierto"
                                servicioNuevo.className = ""
                                servicioNuevo.innerHTML = `
                                    <div id="${serv.id}" class="card" style="width: 100%;">
                                        <div class="card-body">
                                            <h4 class="card-title">${serv.servicio}</h4>
                                            <p>${serv.especialidad}</p>
                                            <p>Precio: $ ${serv.precio} - ${infoCubre}</p>
                                        </div>
                                        
                                </div> `
                        }
                        //Escribo el elemento en el catálogo de servicios
                        
                        servAgregado.append(servicioNuevo)
                        let totalNoCubierto = servNoCubiertos.reduce((acc,elem) => acc + elem.precio, 0)
                        let totalCubierto = servSeleccCubierto.reduce((acc,elem) => acc + elem.precio, 0)
                        let total = array.reduce((acc,elem) => acc + elem.precio, 0)
                        precioServ.innerText = `Total: $${total}`
                        cubrePrepaga.innerHTML = `Con ${prepaga.nombre} - Cubierto $${totalCubierto}, No cubierto: $${totalNoCubierto}`
                        botonSelecc.innerHTML = `<button id="btnBorrarSelecc" class="btn btn-secondary mx-2 bottom">Borrar selección</button>`
                        
                        
                        }

                        //Defino evento para borrar los servicios seleccionados con el boton de borrado
                    btnBorrarSelecc.addEventListener("click", () => {
                        localStorage.removeItem('servSelecc');
                        haySeleccion = false
                        arrServSeleccionados = []
                        servNoCubiertos = []
                        servAgregado.innerHTML = "Todavía no seleccionaste servicios"
                        precioServ.innerHTML = ""
                        botonSelecc.innerHTML = ""
                        botonCubre.innerHTML = ""

                    
                    })




                    
                })//fin then del fetch

        
            
        

        /* botonCubre.addEventListener("click",()=>{
            let cubrePrepaga = document.getElementById("cubrePrepaga")
            if (ingresadoFlag){
                let dni = JSON.parse(sessionStorage.getItem("dni"))
                let datosPaciente = JSON.parse(localStorage.getItem(dni))
                servCubiertos = prepagaGuardada.servicios
                let prep = parseInt(datosPaciente.prepaga)
                console.log(prep)

                if (prep != 5){
                    //Metodo fetch para verificar que cubre la prepaga del paciente
                    fetch("prepagas.json")
                    .then((res)=>res.json())
                    .then((data)=>{
                        console.log(data)
                        let prepagas = data.map((el) =>el.nombre)
                        console.log(prepagas)
                        let prepaga = data.find((ele)=>ele.nombre === prepagas[prep-1])
                        console.log(prepaga)
                        
                        //localStorage.setItem("prepaga",JSON.stringify(prepaga))
                    })

                    //me robe de arriba
                    let servCubiertos = prepagaGuardada.servicios
                    let cubre = servCubiertos.some((el)=>el===serv.servicio)
                    !cubre && servNoCubiertos.push(serv)
                    let totalNoCubierto = servNoCubiertos.reduce((acc,elem) => acc + elem.precio, 0)
                    let totalCubierto = servSeleccCubierto.reduce((acc,elem) => acc + elem.precio, 0)
                    cubrePrepaga.innerText = `Tu prepaga cubre: ${separarArrayStr(prepaga.servicios)}. `
                }else{
                    cubrePrepaga.innerText = "Deberás ingresar como privado"
                }


            }else{
                Swal.fire({
                    icon: 'warning',
                    text: 'Primero debes ingresar con tu dni',
                  })
            }
        }) */
    }else{
        servAgregado.innerHTML = "Todavía no seleccionaste servicios"
    }
    
}
function tiempoConsultaFunc(timeUlt){
    const Interval = luxon.Interval; 
    let tiempoConsulta
    let ahora
    setInterval(()=>{
        ahora = DateTime.now()
        tiempoConsulta = Interval.fromDateTimes(timeUlt,ahora);
        console.log(tiempoConsulta)
        ultConsulta.innerHTML = `Tu última consulta para pedir turno fue hace ${tiempoConsulta.length("seconds")} segundos`
    },10000)}
//Filtrar por especialidad
filtroServicios.addEventListener("change", () => {
    // console.log("Detecto cambio")
    console.log(filtroServicios.value)
    let servFiltrados = consultaServicios(serviciosDisponibles,especialidades,filtroServicios.value)
    mostrarCatalogoDOM(servFiltrados)
    
})
function separarArrayStr(array){
    let separado = array[0]
    
    for(let i = 1;i <array.length;i++){
        separado = separado + ", " + array[i]
    }
    return separado
}
//Eventos
//Turnos
//Paciente ya ingresado
btnIngresado.addEventListener("click", () => {
    pacNuevo = false
    infoPaciente.innerHTML = `<form id = "formPaciente" name = "formPaciente" action="">
    <label for="DNI">DNI: </label>
    <input type="number" name="dni" id="nombre" required>
    <input type="submit" value="Ingresar" class="btn-danger">
    
</form>`
    let formPaciente = document.querySelector("form");
    formPaciente.addEventListener("submit", (event)=>{
        event.preventDefault();
        console.log("Formulario Enviado"); 
        ingresadoFlag = true //Levanto la bandera del registro para la consulta y las herramientas
        if(!(JSON.parse(localStorage.getItem(String(formPaciente["dni"].value))))){
            divErrorIngreso.innerHTML = `El DNI ingresado no estaba registrado.`
        }else{
            divErrorIngreso.innerHTML = ``
            sessionStorage.setItem("dni",String(formPaciente["dni"].value))
            
        }
        
    })
    /* let cubrePrepaga = document.getElementById("cubrePrepaga")
    let prepagaSelect = document.getElementById("idPrepaga")
    prepagaSelect.addEventListener("change", () => {
        // console.log("Detecto cambio")
        console.log(prepagaSelect.value)
        
        if (prepagaSelect.value != 5){
            //Metodo fetch para verificar que cubre la prepaga del paciente
            fetch("prepagas.json")
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data)
                let prepagas = data.map((el) =>el.nombre)
                let prepaga = data.find((ele)=>ele.nombre === prepagas[prepagaSelect.value-1])
                console.log(prepaga)
                cubrePrepaga.innerText = `Tu prepaga cubre: ${separarArrayStr(prepaga.servicios)}`
                //localStorage.setItem("prepaga",JSON.stringify(prepaga))
            })
        }else{
            cubrePrepaga.innerText = "Deberás ingresar como privado"
        }
         
    }) */
})
//Paciente nuevo
btnNuevo.addEventListener("click", () => {
    pacNuevo = true
    infoPaciente.innerHTML = `<form id = "form" action="">
    <label for="nombre">Nombre: </label>
    <input type="text" name="nombre" id="">
    <label for="Nombre">Apellido: </label>
    <input type="text" name="apellido" id="" required>
    <label for="DNI">DNI: </label>
    <input type="number" name="dni" id="" required>
    <label for="DNI">Celular: </label>
    <input type="number" name="celular" id="" required>
    <label for="">Selecioná tu prepaga:</label>
    <select name="prepaga" id="idPrepaga" required>
        <option value="1">Swiss Medical</option>
        <option value="2">OSDE</option>
        <option value="3">Galeno</option>
        <option value="4">Medicus</option>
        <option value="5">Otra/No tengo</option>
    </select>
    <div id="cubrePrepaga"></div>
    <input type="submit" value="Registrarme" class="btn-danger">
    
    </form>`
    /* let cubrePrepaga = document.getElementById("cubrePrepaga")
    let prepagaSelect = document.getElementById("idPrepaga")
    prepagaSelect.addEventListener("change", () => {
        // console.log("Detecto cambio")
        console.log(prepagaSelect.value)
        
        if (prepagaSelect.value != 5){
            //Metodo fetch para verificar que cubre la prepaga del paciente
            fetch("prepagas.json")
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data)
                let prepagas = data.map((el) =>el.nombre)
                let prepaga = data.find((ele)=>ele.nombre === prepagas[prepagaSelect.value-1])
                console.log(prepaga)
                cubrePrepaga.innerText = `Tu prepaga cubre: ${separarArrayStr(prepaga.servicios)}`
                //localStorage.setItem("prepaga",JSON.stringify(prepaga))
            })
        }else{
            cubrePrepaga.innerText = "Deberás ingresar como privado"
        }
         
    }) */

    let formPaciente = document.querySelector("form");
    formPaciente.addEventListener("submit", (event)=>{
        event.preventDefault();
        console.log(formPaciente["nombre"].value)
        console.log("Formulario Enviado"); 
        ingresadoFlag = true //Levanto la bandera del registro para la consulta y las herramientas
        //let paciente = new Paciente(formPaciente)
        let paciente = {
            nombre : formPaciente["nombre"].value,
            apellido : formPaciente["apellido"].value,
            celular : formPaciente["celular"].value,
            dni : formPaciente["dni"].value,
            prepaga : formPaciente["prepaga"].value,
        }
        localStorage.setItem(String(formPaciente["dni"].value),JSON.stringify(paciente))
        sessionStorage.setItem("dni",String(formPaciente["dni"].value))
        
    })
})

function escribirConsulta(formDispo,servicios,pacNuevo){
    let dni = JSON.parse(sessionStorage.getItem("dni"))
    let datosPaciente = JSON.parse(localStorage.getItem(dni))
    console.log(datosPaciente)
    console.log(datosPaciente)
    /* form = formulario.getValues() */
    let servInteres= servicios.map((el) =>el.servicio)
    let Nuevo= pacNuevo ? "nuevo" : "ya ingresado"
    //Escribo mi consulta
    let consulta = `<h4>Tu consulta</h4>
    <h5>Tu datos</h5>
    <p>Nombre: ${datosPaciente.nombre}</p>
    <p>Apellido: ${datosPaciente.apellido}</p>
    <p>DNI: ${datosPaciente.dni}</p>
    <p>Prepaga: ${nombresPrepagas[datosPaciente.prepaga-1]}</p>
    <p>Paciente: ${Nuevo}</p>
    <h5>Servicios consultados</h5>
    <p>Disponibilidad:${horarios[formDispo["dispo"].value-1]} </p>
    <p>Servicios de interés: ${separarArrayStr(servInteres)}</p>`
    //horarios[formDispo["dispo"].value-1] ESTO IBA ADENTRO DE DISPO
    //Aprovecho a guardar la data del paciente
    consultaPaciente.innerHTML = consulta
    /* let paciente = new Paciente(formulario)
    localStorage.setItem(String(formulario["dni"].value),JSON.stringify(paciente)) */
    //Guardo consulta también
    localStorage.setItem("ultConsulta",JSON.stringify(consulta))
}

btnConsulta.addEventListener("click",()=>{
    //Para poder escribir la consulta necesito: selección de servicio,paciente ingresado y disponibilidad
    let formDispo = document.getElementById("dispo")
    if (ingresadoFlag && haySeleccion){
        //Si ya ingresó y hay selección entonces
        okConsulta = true
        //console.log(formPaciente)
        escribirConsulta(formDispo,arrServSeleccionados,pacNuevo)
    }else{
        Swal.fire({
            icon: 'warning',
            text: 'Para poder escribir la consulta debes estar ingresado y tener servicios seleccionados',
          })
    }
})

//Envío consulta
btnEnviarConsulta.addEventListener("click",( )=>{
    if (okConsulta){
        let timeUltConsulta = DateTime.now()
        /* tiempoConsultaFunc(DateTime.now()) */
        localStorage.setItem("ultConsultaTiempo", JSON.stringify(timeUltConsulta))
        const Interval = luxon.Interval; 
        let tiempoConsulta
        let ahora
        ultConsulta.innerHTML = `Tu última consulta para pedir turno fue hace 0 segundos`
        setInterval(()=>{
            ahora = DateTime.now()
            tiempoConsulta = Interval.fromDateTimes(timeUltConsulta,ahora);
            console.log(tiempoConsulta)
            ultConsulta.innerHTML = `Tu última consulta para pedir turno fue hace ${tiempoConsulta.length("seconds")} segundos`
        },10000)
    
    }else{
            Swal.fire({
                icon: 'warning',
                title: 'Primero debes ingresar tus datos',
            })
        }

    })



//Herramientas
//Presion
btnPresion.addEventListener("click", () => {
    let resultado
    
    console.log(presionSis.value)
    if((!parseFloat(presionSis.value))||(!parseFloat(presionDias.value))){
        Swal.fire({
                    icon: 'warning',
                    title: 'Ingrese valores numéricos',
                  })
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
        Swal.fire({
            icon: 'warning',
            title: 'Ingrese valores numéricos',
          })
        resultadoimc = ""
    }else{
        resultadoimc = imc(parseFloat(peso.value),parseFloat(altura.value))
        console.log(resultadoimc)
        resultIMC.innerText = `Su IMC es: ${resultadoimc}`
    }
     
})


//DARKMODE
//Tomada de la clase y modificada al principio
let btnToggle = document.getElementById("btnToggle")
console.log(btnToggle)

if(!(localStorage.getItem("modoOscuro"))){
    //Agregué el not para evitar un if con un caso vacío
    console.log("SETEAMOS POR PRIMERA VEZ")
    localStorage.setItem("modoOscuro", false)
}

if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
    document.body.classList.toggle("darkMode")
    btnToggle.innerText = "Modo Claro"
}

//Evento darkmode
btnToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode")
    if(JSON.parse(localStorage.getItem("modoOscuro")) == false){
        //Va a cambiar a modo oscuro, el boton se cambia a "modo claro" porque ahora es la alternativa
        btnToggle.innerText = "Modo Claro"
        localStorage.setItem("modoOscuro", true)
    }
    else if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
        //Va a cambiar a modo claro nuevamente, ahora volvemos a poner "modo oscuro" porque es la alternativa
        btnToggle.innerText = "Modo Oscuro"
        localStorage.setItem("modoOscuro", false)
    }
})
//Luxon: lo voy a usar para 2 cosas - Calcular edad y definir cuando mandaste una consulta
const DateTime = luxon.DateTime
 
/
    






//Constructores y clases
/* class PacienteNuevo{
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

} */

function Paciente(formulario){
        this.nombre = formulario["nombre"].value;
        this.apellido = formulario["apellido"].value;
        this.celular = formulario["celular"].value;
        this.dni = formulario["dni"].value;
        this.prepaga = formulario["prepaga"].value
}

//servConsulta = serviciosSelect.map((el)=>el.servicio)
/* class Consulta(dni,disponibilidad,servSelecc){
    this.dni = dni;
    this.disponibilidad = disponibilidad;
    this.servSelecc = {...servSelecc};

} */

function Servicio(servicio,precio,descrip, especialidad,imagen) {
    this.servicio = servicio;
    this.precio = precio;
    this.descripcion = descrip;
    this.especialidad = especialidad;
    this.imagen = imagen

}

class UltimaConsulta{
    constructor(consulta,tiempo){
        this.consulta = consulta;
        this.tiempo = tiempo;
    }
}
//Datos del sistema
const prepagasAceptadas = ["Swiss Medical","OSDE","Galeno","Medicus"]
const especialidades = ["Ginecología","Oftalmología","Cardiología","Clínica","Dermatología"]
//Servicios
const consulta = new Servicio("Consulta",7000,"Consulta con el especialista. Para chequeos de rutina o para consultar por sítnomas o cuadros específicos. ","Todas","consulta.jpg")
const revision = new Servicio("Revisión de estudios",5000,"Consulta para revisar estudios solicitados previamente y dar una devolución con un plan de acción","Todas","revisionEstudios.jpg")
const  pap = new Servicio("PAP",2000,"Papanicolau: para detectar cambios en las células del cuello uterino. Incluye la toma de muestras y el laboratorio. Lo reasliza un/a ginecólogo/a","Ginecología","pap.jpg")
const ecg = new Servicio("ECG",2000,"Electrocardiograma(ECG): Se estudia la actividad eléctrica del corazón. Lo realiza un/a cardiólogo/a o un técnico de ECG.","Cardiología","ecg.jpg")
const ergometria = new Servicio("Ergometría",5000,"Es una prueba de ejercicio físico donde se registra la actividad del corazón con electrodos bajo esfuerzo. Puede hacerse en bicicleta o en cinta. En nuestro consultorio se realiza en cinta.","Cardiología","ergometria.jpg")
const peeling = new Servicio("Peeling",10000,"Peeling: Tratamiento dermatológico que busca renovar la dermis a partir de una solución química que exfolia las capas externas de la piel.","Dermatología","peeling.jpeg")
const fondoOjos = new Servicio("Fondo de ojos",2000,"Permite observar la parte posterior del interior del ojo. Para ello se usan gotas que dilatan las pupilas y cuyo efecto dura unas horas. Se usa para prevenir o hacer el seguimiento de enfermedades.","Oftalmología","fondoOjos.jpg")
//Todos los servicios
const serviciosDisponibles = [consulta,revision, pap, ecg, peeling, fondoOjos, ergometria]
const horarios = ["Mañana","Tarde","Mañana y Tarde"]
const nombresPrepagas = ["Swiss Medical","OSDE","Galeno","Medicus","Otra/No Tengo"]

//Nueva consulta
let nuevaConsulta = []
let pacNuevo 
let haySeleccion
let okConsulta = false
let ingresadoFlag = false //bandera para asegurarme que está ingresado

//Hago el caso de primera vez o no para los servicios seleccionados, dado que guardo la selección del usuario hasta que envía la consulta
let arrServSeleccionados = []
let servNoCubiertos = []
let servSeleccCubierto = []
if(localStorage.getItem("servSelecc")){
    //solo entro en el caso de que se haya guardado (quedo la accion de envio de consulta inconclusa)
    haySeleccion = true
    for(let serv of JSON.parse(localStorage.getItem("servSelecc"))){
        let servClase = new Servicio (serv.servicio, serv.precio, serv.descripcion, serv.especialidad, serv.imagen)
        arrServSeleccionados.push(servClase)
    }

}

//

//Interacción semilla
mostrarCatalogoDOM(serviciosDisponibles)
mostrarServSelecc(arrServSeleccionados)
/* if(localStorage.getItem("ultConsultaTiempo")){
    tiempoConsultaFunc(JSON.parse(localStorage.getItem("ultConsultaTiempo")))
} */

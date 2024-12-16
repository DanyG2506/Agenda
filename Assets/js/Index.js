$(document).ready(function(){
    init();
    bindEvent();
})

function init(){
    let bodyContent = $("#bodycontent");
    let data = getData();
    let result = constructorCardBody(data);
    bodyContent.empty();
    bodyContent.append(result);
}

function getData(){
    return JSON.parse(localStorage.getItem("Notas") || "[]")
}

function constructorCardBody(data){
    let returndata = '';

    if(data.length == 0){
        returndata = `<h5>Sin Resultados</h5>`
        return returndata;
    }

    let html = data.map(x => {
        let datax = JSON.stringify(x)
        return (`
                    <div class="card mt-3">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-md-6">
                                    ${moment(x.fecha).format("DD/MM/YYYY hh:mm:ss A")}
                                </div>
                                <div class="col-md-6 d-flex justify-content-end">
                                    <button onclick='editarObservacion(${datax})' title="Editar" class="btn btn-info mr-5"><i class="fa fa-edit"></i></button>
                                    <button onclick='eliminarObservacion(${datax})' title="Eliminar" class="btn btn-danger"><i class="fa fa-eraser"></i></button>
                                </div>
                            </div>
                            
                        </div>
                        <div class="card-body">
                            <strong>${x.observacion}</strong>
                        </div>
                    </div>
                `)
    })

    return html;
}

function bindEvent(){
    $("#btnLimpiarObservacion").on('click',function(){
        $("#txtObservacion").val('');
    })

    $("#btnAgregarObservacion").on('click',function(){
        addObservation();
    })

    $("#btnEditarObservacion").on('click',function(){
        editObservation();
    })
}

function addObservation(){
    const txtObservacion = $("#txtObservacion").val();

    if(!txtObservacion){
        alert("No se puede agregar una observación vacia, favor llenar el campo.")
        return false;
    }

    let data = getData();

    const existeObservacion = data.some(x => x.observacion.replaceAll(" ","").toLowerCase() == txtObservacion.replaceAll(" ","").toLowerCase())

    if(existeObservacion){
        alert("No se puede agregar una observación más de una vez")
        return false;
    }

    let dataObservacion = {
        id: generarIdUnico(),
        fecha: new Date(),
        observacion: txtObservacion
    }

    
    data.push(dataObservacion);
    localStorage.setItem("Notas",JSON.stringify(data))
    cleanForm();   
}

function generarIdUnico(){
    const caracteres = '0123456789';
    const longitud = 6;
    return Array.from({ length: longitud }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length)))
                .join('');
}

function cleanForm(){
    $("#btnLimpiarObservacion").click();
    $("#btnAgregarObservacion").css("display","");
    $("#btnEditarObservacion").css("display","none");
    init();
}

function editarObservacion(data){
    let observacion = data.observacion;

    $("#btnAgregarObservacion").css("display","none");
    $("#btnEditarObservacion").css("display","");
    $("#txtObservacion").val(observacion);
    sessionStorage.setItem("editado",JSON.stringify(data));
}

function eliminarObservacion(dataLocal){
    let data = getData()
    data = data.filter(x => x.id != dataLocal.id);

    localStorage.setItem("Notas", JSON.stringify(data));
 
    cleanForm();
}

    function editObservation(){
        const txtObservacion = $("#txtObservacion").val();
        const editado = JSON.parse(sessionStorage.getItem("editado"))

        if(!txtObservacion){
            alert("No se puede agregar una observación vacia, favor llenar el campo.")
            return false;
        }

        let data = getData()
        data = data.map(x => {
            if (x.id === editado.id) {
                x.observacion = txtObservacion;
            }
            return x; 
        });
    
        localStorage.setItem("Notas", JSON.stringify(data));
 
        cleanForm();
    }
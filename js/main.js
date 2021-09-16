var catBreeds = [];
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const dbName = "petDB";
const myLocalStorage = window.localStorage;
var row=0;

fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(data => {       
        let petBreed = document.getElementById("raza");
        Object.keys(data.message).map((breed) => {
            let option = document.createElement("option");
            option.innerHTML = breed;
            petBreed.appendChild(option);
        });
    });

fetch('https://api.thecatapi.com/v1/breeds')
	.then(response => response.json())
	.then(data => {
        catBreeds = data;
        let catBreed = document.getElementById("catraza");
        data.forEach((breed) => {
            let option = document.createElement("option");
            option.innerHTML = breed.name;
            catBreed.appendChild(option);
        }); 
    });
    
    document.getElementById("especie1").onclick = function(){    
    let especie1 =document.getElementById("especie1").value;
    console.log(document.getElementById("especie1").value);
    if(especie1==="Perro"){
        console.log("Perro");
        document.getElementById("raza").removeAttribute("disabled");
        document.getElementById("catraza").setAttribute("disabled",true);
    }else if(especie1==="Gato"){
        console.log("gato");
        document.getElementById("catraza").removeAttribute("disabled");
        document.getElementById("raza").setAttribute("disabled",true);
    }
    };
    
        var request = indexedDB.open(dbName, 1);
        request.onerror = function(event) {
            console.log("Database error");
        };
        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("pets", { keyPath: "id" });
            objectStore.createIndex("petNameInput", "petNameInput", { unique: false });
        };
    
    
        
    (function() {
        var formulario=document.getElementByClassName("needs-validation");
        var validation = Array.prototype.filter.call(formulario, function(form) {
            form.addEventListener('submit', function(event) {     
                if(form.checkValitidy()===false){
                    event.preventDefault();             
                    event.stopPropagation();
                }
               else if(form.checkValitidy()===true){
                    row+=1;
                    let pet={
                         dateinput : document.getElementById("fecha").value,                        
                            nombreDueño: document.getElementById("nombreProp").value,
                            nombreMascota: document.getElementById("nombreMas").value,
                            microchip: document.getElementById("microchip").value,
                            edad: document.getElementById("edad").value,
                            especie: document.getElementById("especie").value,              
                            sexo: document.getElementById("sex").value,
                            tam: document.getElementById("tamaño").value,
                            peligro: document.getElementById("peligroso").value,
                            esterilizado: document.getElementById("esterilizado").value,
                            localidad: document.getElementById("localidad").value,
                            fechaEsterilizacion: "",
                            fechaImplantacion: "",
                            fechaEdicion:""
                    };
                    let tr = document.createElement("tr");
                    tr.setAttribute("id", "row-" + rowId);         
                    let especie=document.getElementById("especie");
                    if(especie==="perro"){
                        let tdimg = document.createElement("td");
                        let img = document.createElement("img");
                        let razaPerro = document.getElementById("raza").value;
                        fetch('https://dog.ceo/api/breed/' + razaPerro + '/images/random')
                            .then(response => response.json())
                            .then(data => {
                                img.setAttribute("class","rounded");
                                img.setAttribute("alt","Cinque Terre");
                                img.setAttribute("id","img-"+rowId);
                                img.setAttribute("width","200" );
                                img.setAttribute("height","156");
                                img.setAttribute("src",data.message);
                                let myLocalStorage = window.localStorage;
                                myLocalStorage.setItem(rowId, data.message);
                            });      
                             tdimg.appendChild(img);
                             tr.appendChild(tdimg); 
                    }else if(especie==="gato"){
                            let tdimg = document.createElement("td");
                            let img = document.createElement("img");
                            let razaGato = document.getElementById("catraza").value;
                            let razaId =catBreeds.find(breed => razaGato===breed.name).id;
                            fetch('https://api.thecatapi.com/v1/images/search?breed_ids='+razaId)
                            .then(response => response.json())
                            .then(data => {
                             let catimage = data.map(cat=>cat.url);                              
                             catimage.forEach(function(image)  {
                                    img.setAttribute("class","rounded");
                                    img.setAttribute("id","img-"+rowId);
                                    img.setAttribute("alt","Cinque Terre");
                                    img.setAttribute("width","200" );
                                    img.setAttribute("height","156");
                                    img.setAttribute("src",image);                            
                                    let myLocalStorage = window.localStorage;
                                    myLocalStorage.setItem(rowId, image);
                                });                              
                            });    
                            tdimg.appendChild(img);
                            tr.appendChild(tdimg); 
                    }   
                    Object.keys(pet).forEach((key) => {
                    let td = document.createElement("td");
                    td.innerHTML= pet[key];
                    tr.appendChild(td);
                });
                let tdActions = document.createElement("td");

                let input = document.createElement("input");
                input.setAttribute("id", "delete-" + rowId);
                input.setAttribute("type", "button");
                input.value = "Eliminar";
                            
                tdActions.appendChild(input);
                
                let inputeditar = document.createElement("input");
                inputeditar.setAttribute("id", "editar-" + rowId);
                inputeditar.setAttribute("type", "button");
                inputeditar.value = "Editar";  
                event.preventDefault();             
                event.stopPropagation();
                
                tdActions.appendChild(inputeditar);
                tr.appendChild(tdActions);
                document.getElementById("body-table").appendChild(tr);
                           var request = indexedDB.open(dbName, 1);
                           request.onsuccess = function(event) {
                           var db = event.target.result;
                           var customerObjectStore = db.transaction("pets", "readwrite").objectStore("pets");
                           pet["id"] = rowId;
                           customerObjectStore.add(pet);
                       };
                }
                form.classList.add("was-validated");
            },false);        
        });
        
        
    })();
        
    
        function updata(){
            var request = indexedDB.open(dbName, 1);
            request.onsuccess = function(event) {
                var db = event.target.result;
                var tx = db.transaction("pets");
                var objectStore = tx.objectStore("pets");
                objectStore.getAll().onsuccess = function(event) {
                    rowId = event.target.result.length;
            if(rowId>0){
                for(let i=0;i<rowId;i++){
                    let tr = document.createElement("tr");
                    tr.setAttribute("id", "row-" + (i+1));            
                    let tdimg = document.createElement("td");
                    let img = document.createElement("img");
                    let myLocalStorage = window.localStorage;
                    let imagen = myLocalStorage.getItem(i+1);
                    console.log(imagen);
                    img.setAttribute("class","rounded");
                    img.setAttribute("id","img-"+(i+1));
                    img.setAttribute("alt","Cinque Terre");
                    img.setAttribute("width","200" );
                    img.setAttribute("height","156");
                    img.setAttribute("src",imagen);
                    tdimg.appendChild(img);
                    tr.appendChild(tdimg); 
                    let pet= {
                        dateinput : event.target.result[i].dateinput,                        
                        ownername: event.target.result[i].ownername,
                        petname: event.target.result[i].petname,
                        microchipnum: event.target.result[i].microchipnum,
                        petage: event.target.result[i].petage,
                        petspecie: event.target.result[i].petspecie,
                        petsex: event.target.result[i].petsex,
                        petsize: event.target.result[i].petsize,
                        dangerousinput: event.target.result[i].dangerousinput,
                        esterilizadoinput: event.target.result[i].esterilizadoinput,
                        neightborinput: event.target.result[i].neightborinput
                    };
                    Object.keys(pet).forEach((key) => {
                        let td = document.createElement("td");
                        td.innerHTML= pet[key];
                        tr.appendChild(td);
                    });
                    let tdActions = document.createElement("td");
                    let input = document.createElement("input");
                    input.setAttribute("id", "delete-" + (i+1));
                    input.setAttribute("type", "button");
                    input.value = "Eliminar";
                    input.onclick = function() {   
                        let id = this.getAttribute("id");
                        id = +id.replace("delete-", "");
                        document.getElementById("row-" + id).remove();       
                        myLocalStorage.removeItem(id);
                    };
                    tdActions.appendChild(input);
                    //tr.appendChild(tdActions);
                    let inputeditar = document.createElement("input");
                    inputeditar.setAttribute("id", "editar-" + (i+1));
                    inputeditar.setAttribute("type", "button");
                    inputeditar.setAttribute("data-toggle","modal" );
                    inputeditar.value = "Editar";               
                    tdActions.appendChild(inputeditar);
                    tr.appendChild(tdActions);
                    document.getElementById("body-table").appendChild(tr);
                }
            }
        };
    };
}

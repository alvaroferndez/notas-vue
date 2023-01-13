const { createApp } = Vue

createApp({
      data() {
            return {
                  proyectos:this.obtenerProyectos(),
                  filtrado:"",
                  filtrado_prioridad:[],
                  imagen_eliminar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfiMi9XJEDu2zLYRJfLgMj_6pcmaHbRDv-Yw&usqp=CAU",
                  nuevo_proyecto:"",
                  codigo:0,
            }
      },
      methods:{
            actualizarLocalStorage(){
                  localStorage.proyectos = JSON.stringify(this.proyectos);
            },

            obtenerProyectos(){
                  lista = [];
                  if(localStorage.proyectos){
                        lista = JSON.parse(localStorage.proyectos);
                  }
                  return lista;
            },

            nuevoProyecto(){      
                  this.codigo++;
                  this.proyectos.push({
                        codigo:this.codigo,
                        nombre:this.nuevo_proyecto,
                        prioridad:"normal",
                        tiempo:Date.now(),
                        completada:false,
                  })
                  this.actualizarLocalStorage();
                  this.nuevo_proyecto="";
            },

            calcularTiempo(proyecto){
                  return Math.floor(((Date.now() - proyecto.tiempo)/1000)/60);
            },

            cambiarPrioridad(proyecto,prioridad){
                  proyecto.prioridad = prioridad;
                  this.actualizarLocalStorage();
            },

            rellenarPrioridad(proyecto,prioridad){
                  if(proyecto.prioridad == prioridad){
                        return true;
                  }
            },

            ordenarProyectos(array){
                  arrayOrdenado = array.sort((proyectoA, proyectoB)=>{
                        if(proyectoA.prioridad == proyectoB.prioridad){
                            return 0;
                        }else if(proyectoB.prioridad == "alta"){
                            return 1;
                        }else if((proyectoB.prioridad == "normal") && (proyectoA.prioridad == "baja")){
                            return 1;
                        }else if((proyectoA.prioridad == "alta") && (proyectoB.prioridad != "alta")){
                            return -1;
                        }else if((proyectoA.prioridad == "normal") && (proyectoB.prioridad == "baja")){
                            return -1;
                        }
                  });
                
                  return arrayOrdenado;
            },

            finalizarProyecto(proyecto){
                  proyecto.completada = !proyecto.completada;
                  this.actualizarLocalStorage();
            },

            eliminarProyecto(proyecto){
                  lista_proyectos = this.proyectos.filter((pro) => pro.nombre != proyecto.nombre)
                  this.proyectos = lista_proyectos
                  this.actualizarLocalStorage();
            },

            eliminarFinalizados(){
                  lista_proyectos = this.proyectos.filter((pro) => !pro.completada)
                  this.proyectos = lista_proyectos
                  this.actualizarLocalStorage();
            },
      },
      computed:{
            calcularProyectos(){
                  return this.proyectos.length;
            },

            calcularProyectosTerminados(){
                  return this.proyectos.filter((pro) => !pro.completada).length
            },

            filtrarProyectos(){
                  lista_filtrada = this.proyectos;
                  array = []
                  if(this.filtrado_prioridad.length > 0){
                        for (let prio of this.filtrado_prioridad){
                              array = array.concat(lista_filtrada.filter((pro) => pro.prioridad.includes(prio)))
                        };
                        lista_filtrada = this.ordenarProyectos(array);
                  }
                  if(this.filtrado != ""){
                        array = lista_filtrada.filter((pro) => pro.nombre.toLowerCase().includes(this.filtrado.toLowerCase()));
                        lista_filtrada = this.ordenarProyectos(array);
                  }
                  if(lista_filtrada.length > 0){
                        return this.ordenarProyectos(lista_filtrada);
                  }else{
                        return false
                  }
            },
      }
}).mount('#contenedor-body')
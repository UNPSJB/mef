/**
 * COMO SE USA ESTE SCRIPT
 * Necesitas:
 * 1.- Un input con id "buscaSubclases"
 * 2.- Un div (o algo) con id "resultadosDeSubclases"
 * 
 */

const input = document.getElementById('buscaSubclases');
input.addEventListener('input', buscarSubclases);

function buscarSubclases() {
  fetch('http://localhost:3000/subclases/api', { credentials: 'same-origin' })
    .then((res) => {
      return (res.json());
    })
    .then((res) => {
      let resultados = filtrar(res);
      dibujarOpciones(resultados);
    })
}
function filtrar(subclases){
  let resultados = [];
  subclases.forEach((subclase) =>{//por cada que tengamos
    //si cumple la condicion, lo agrega a resultados
    if (subclase.descripcion.search(input.value) >= 0){
      resultados.push(subclase);
    }
  })
  return resultados; //aca estarian los que cumplen
}
function dibujarOpciones(subclases){
  let etiqueta = document.getElementById('resultadosDeSubclases');
  let etiquetas = [];
  etiqueta.innerHTML = " ";
  subclases.forEach((subclase)=>{
    if(input.value !== ''){        
      let boton = 
      `<label class="btn btn-secondary form-check-label">
      <input type="radio" class="form-check-input" name="idsubclase" value="${subclase.id}" autocomplete="off" required> ${subclase.descripcion}
      </label>
      `;
      etiquetas.push(boton);
    }
  });
  etiqueta.innerHTML = etiquetas;
}
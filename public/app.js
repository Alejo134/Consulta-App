// Obtén el formulario y el campo de entrada
const form = document.getElementById('consultaForm');
const nroMatriculaInput = document.getElementById('nro_matricula');
const resultadoDiv = document.getElementById('resultado');

// Evento de envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Evita el comportamiento por defecto del formulario (recargar la página)

  const nroMatricula = nroMatriculaInput.value;

  // Llamada a la API del backend para consultar la matrícula
  fetch(`/consultar/${nroMatricula}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    resultadoDiv.style.display = 'block';
    if (!data.nro_matricula) {
      resultadoDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${data.nombre_completo}</p>
        <p><strong>DNI:</strong> ${data.dni}</p>
        <a href="${data.linkCategoria}" target="_blank">Link para abonar</a>
      `;
    } else {
      resultadoDiv.innerHTML = `<p>Matrícula no encontrada.</p>`;
    }
  })
  .catch((error) => {

    console.error('Error en el fetch:', error);

    resultadoDiv.style.display = 'block';
    resultadoDiv.innerHTML = `<p>Matrícula no encontrada.</p>`;
  });
});


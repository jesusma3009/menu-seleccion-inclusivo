class BotonMenu {
  constructor(boton, menu, retroalimentacion) {
    this.boton = boton;
    this.menu = menu;
    this.retroalimentacion = retroalimentacion;
    this.elementosMenu = menu.querySelectorAll('[role="menuitemradio"]');

    // Manejar clic y teclas en el botón
    this.boton.addEventListener('click', () => this.toggleMenu());
    this.boton.addEventListener('keydown', (e) => this.manejarTecla(e));

    // Manejar teclas en los elementos del menú
    this.elementosMenu.forEach(item =>
      item.addEventListener('keydown', (e) => this.manejarTeclaMenu(e, item))
    );

    // Manejar la selección de un elemento
    this.elementosMenu.forEach(item =>
      item.addEventListener('click', () => this.seleccionarElemento(item))
    );
  }

  toggleMenu() {
    const estaExpandido = this.boton.getAttribute('aria-expanded') === 'true';
    this.boton.setAttribute('aria-expanded', !estaExpandido);
    this.menu.hidden = estaExpandido;
    if (!estaExpandido) this.enfocarPrimerElemento();
    else this.boton.focus();
  }

  abrirMenu() {
    this.boton.setAttribute('aria-expanded', 'true');
    this.menu.hidden = false;
    this.enfocarPrimerElemento();
  }

  cerrarMenu() {
    this.boton.setAttribute('aria-expanded', 'false');
    this.menu.hidden = true;
    this.boton.focus();
  }

  enfocarPrimerElemento() {
    const primerElemento = this.menu.querySelector('[aria-checked="true"]') || this.elementosMenu[0];
    primerElemento.focus();
  }

  manejarTecla(e) {
    if (e.key === 'ArrowDown') {
      this.abrirMenu();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleMenu();
    }
  }

  manejarTeclaMenu(e, item) {
    if (e.key === 'ArrowDown') {
      this.enfocarSiguienteElemento(item);
    } else if (e.key === 'ArrowUp') {
      this.enfocarElementoAnterior(item);
    } else if (e.key === 'Escape') {
      this.cerrarMenu();
    }
  }

  enfocarSiguienteElemento(itemActual) {
    const indiceActual = Array.from(this.elementosMenu).indexOf(itemActual);
    const siguienteElemento = this.elementosMenu[(indiceActual + 1) % this.elementosMenu.length];
    siguienteElemento.focus();
  }

  enfocarElementoAnterior(itemActual) {
    const indiceActual = Array.from(this.elementosMenu).indexOf(itemActual);
    const indiceAnterior = (indiceActual - 1 + this.elementosMenu.length) % this.elementosMenu.length;
    const elementoAnterior = this.elementosMenu[indiceAnterior];
    elementoAnterior.focus();
  }

  seleccionarElemento(item) {
    this.elementosMenu.forEach(i => i.setAttribute('aria-checked', 'false'));
    item.setAttribute('aria-checked', 'true');
    this.actualizarRetroalimentacion(item.textContent);
    this.cerrarMenu();
  }

  actualizarRetroalimentacion(eleccion) {
    this.retroalimentacion.textContent = `Tu nivel de dificultad es ${eleccion}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('botonMenu');
  const menu = document.getElementById('menu');
  const retroalimentacion = document.getElementById('retroalimentacionMenu');

  new BotonMenu(boton, menu, retroalimentacion);
});

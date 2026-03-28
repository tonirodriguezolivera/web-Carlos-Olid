/* Utilidades */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* Año actual */
(function setYear(){
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* Menú móvil */
(function mobileMenu(){
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  const siteNav = $('.site-nav');
  if (!burger) return;
  const toggle = () => {
    const isOpen = mobileMenu ? mobileMenu.classList.toggle('open') : false;
    if (siteNav) {
      siteNav.classList.toggle('open');
    }
    burger.setAttribute('aria-expanded', String(isOpen || (siteNav && siteNav.classList.contains('open'))));
  };
  burger.addEventListener('click', toggle);
})();

/* Desplazamiento suave con cierre de menú */
(function smoothScroll(){
  const links = $$('a[href^="#"]');
  const header = $('.site-header');
  const mobileMenu = $('#mobileMenu');
  const siteNav = $('.site-nav');
  const burger = $('#burger');
  const isSamePage = (a) => a.pathname === location.pathname && a.host === location.host;
  
  // Función para cerrar el menú
  const closeMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (siteNav) siteNav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  };
  
  links.forEach(link => {
    link.addEventListener('click', e => {
      const a = e.currentTarget;
      if (!(a instanceof HTMLAnchorElement) || !isSamePage(a)) return;
      
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = $(href);
      if (!target) {
        console.log('No se encontró el destino para:', href);
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // Cerrar primero el menú
      closeMenu();
      
      // Usar requestAnimationFrame para mejorar la sincronización del desplazamiento
      requestAnimationFrame(() => {
        // Calcular la altura del encabezado dinámicamente
        const headerHeight = header ? header.offsetHeight : 80;
        const offset = headerHeight + 20;
        
        // Obtener la posición de desplazamiento actual
        const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
        
        // Obtener la posición de destino
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + currentScroll;
        const scrollPosition = Math.max(0, targetPosition - offset);
        
        console.log('Desplazando a:', href, 'Posición destino:', targetPosition, 'Posición scroll:', scrollPosition, 'Actual:', currentScroll);
        
        // Método 1: probar scrollIntoView con bloque al inicio
        try {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Ajustar el offset del encabezado después de iniciar el desplazamiento
          setTimeout(() => {
            const adjustment = offset;
            window.scrollBy(0, -adjustment);
          }, 100);
        } catch (e) {
          console.log('scrollIntoView falló, probando scrollTo:', e);
          
          // Método 2: scrollTo directo
          window.scrollTo({ 
            top: scrollPosition, 
            left: 0,
            behavior: 'smooth' 
          });
        }
      });
    });
  });
})();


/* Modal Sobre mí */
(function aboutModal(){
  const modal = $('#aboutModal');
  const btn = $('#aboutMeBtn');
  const closeBtn = $('#closeModal');
  
  if (!modal || !btn) return;
  
  // Función para cerrar el modal
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Restaurar desplazamiento
  };
  
  // Abrir modal
  btn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Evitar desplazamiento del fondo
  });
  
  // Cerrar modal con el botón de cierre
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Cerrar modal con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
})();

/* Función de descarga de archivos */
async function downloadFile(filePath, fileName) {
  try {
    // Obtener el archivo como Blob
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Error HTTP: estado ${response.status}`);
    }
    const blob = await response.blob();
    
    // Crear una URL de Blob desde el archivo
    const url = window.URL.createObjectURL(blob);
    
    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Forzar la descarga con nombre de archivo
    link.style.display = 'none';
    
    // Añadir al body, hacer clic y eliminar
    document.body.appendChild(link);
    link.click();
    
    // Limpiar: quitar enlace y revocar URL del Blob
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('La descarga falló:', error);
    // Alternativa: intentar descarga directa si falla fetch
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/* Botón de bajar al final de la página */
(function scrollDown(){
  const btn = document.getElementById('scrollDown');
  if (!btn) {
    console.log('No se encontró el botón de bajar');
    return;
  }
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Botón de desplazamiento pulsado');
    
    // Probar varios métodos para asegurar que el desplazamiento funcione
    const body = document.body;
    const html = document.documentElement;
    
    // Obtener la altura real desplazable
    const scrollHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    
    console.log('scrollHeight del body:', body.scrollHeight);
    console.log('scrollHeight del documento:', html.scrollHeight);
    console.log('innerHeight de ventana:', window.innerHeight);
    console.log('Posición de desplazamiento calculada:', scrollHeight);
    
    // Ir al final: usar la posición máxima de desplazamiento
    const maxScroll = scrollHeight - window.innerHeight;
    console.log('Posición máxima de desplazamiento:', maxScroll);
    
    // Intentar desplazamiento
    window.scrollTo({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
    
    // Alternativa: intentar desplazamiento directo del body
    setTimeout(() => {
      if (window.pageYOffset < scrollHeight - 100) {
        body.scrollTop = scrollHeight;
        html.scrollTop = scrollHeight;
      }
    }, 100);
  });
})();


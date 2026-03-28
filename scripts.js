/* Utilities */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* Current year */
(function setYear(){
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* Mobile menu */
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

/* Smooth scroll with menu closing */
(function smoothScroll(){
  const links = $$('a[href^="#"]');
  const header = $('.site-header');
  const mobileMenu = $('#mobileMenu');
  const siteNav = $('.site-nav');
  const burger = $('#burger');
  const isSamePage = (a) => a.pathname === location.pathname && a.host === location.host;
  
  // Close menu function
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
        console.log('Target not found for:', href);
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // Close menu first
      closeMenu();
      
      // Use requestAnimationFrame for better scroll timing
      requestAnimationFrame(() => {
        // Calculate header height dynamically
        const headerHeight = header ? header.offsetHeight : 80;
        const offset = headerHeight + 20;
        
        // Get current scroll position
        const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
        
        // Get target position
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + currentScroll;
        const scrollPosition = Math.max(0, targetPosition - offset);
        
        console.log('Scrolling to:', href, 'Target position:', targetPosition, 'Scroll position:', scrollPosition, 'Current:', currentScroll);
        
        // Method 1: Try scrollIntoView with block start
        try {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Adjust for header offset after scroll starts
          setTimeout(() => {
            const adjustment = offset;
            window.scrollBy(0, -adjustment);
          }, 100);
        } catch (e) {
          console.log('scrollIntoView failed, trying scrollTo:', e);
          
          // Method 2: Direct scrollTo
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


/* About Me Modal */
(function aboutModal(){
  const modal = $('#aboutModal');
  const btn = $('#aboutMeBtn');
  const closeBtn = $('#closeModal');
  
  if (!modal || !btn) return;
  
  // Close modal function
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Open modal
  btn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
  
  // Close modal with close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
})();

/* Download File Function */
async function downloadFile(filePath, fileName) {
  try {
    // Fetch the file as a Blob
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    
    // Create a Blob URL from the file
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Force download with filename
    link.style.display = 'none';
    
    // Append to body, click, then remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up: remove link and revoke Blob URL
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: try direct download if fetch fails
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/* Scroll-down button to bottom of page */
(function scrollDown(){
  const btn = document.getElementById('scrollDown');
  if (!btn) {
    console.log('Scroll down button not found');
    return;
  }
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Scroll button clicked');
    
    // Try multiple methods to ensure scrolling works
    const body = document.body;
    const html = document.documentElement;
    
    // Get the actual scrollable height
    const scrollHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    
    console.log('Body scrollHeight:', body.scrollHeight);
    console.log('Document scrollHeight:', html.scrollHeight);
    console.log('Window innerHeight:', window.innerHeight);
    console.log('Calculated scroll position:', scrollHeight);
    
    // Scroll to bottom - use the maximum scroll position
    const maxScroll = scrollHeight - window.innerHeight;
    console.log('Max scroll position:', maxScroll);
    
    // Try scrolling
    window.scrollTo({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
    
    // Fallback: try scrolling the body directly
    setTimeout(() => {
      if (window.pageYOffset < scrollHeight - 100) {
        body.scrollTop = scrollHeight;
        html.scrollTop = scrollHeight;
      }
    }, 100);
  });
})();


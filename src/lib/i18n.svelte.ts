export type Lang = 'es' | 'en';

let currentLang = $state<Lang>('es');

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
}

export function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
}

export const translations = {
  es: {
    nav: {
      brand: 'LA BESTIA EN LA CUEVA',
      about: 'Inicio',
      playlist: 'YouTube',
      tiktok: 'TikTok',
      projects: 'Proyectos',
      contact: 'Contacto',
      getInTouch: 'Contactar',
    },
    hero: {
      title: 'La Bestia En La Cueva',
      btnExplore: 'Ver Contenido',
      btnContact: 'Contacto',
      socialsHeader: 'Canales y Perfiles',
    },
    playlist: {
      title: 'Producciones & Series',
      videoCount: 'Videos disponibles',
      videoLabel: 'Video',
      of: 'de',
      views: 'vistas',
      btnYoutube: 'Canal de YouTube',
      emptyTitle: 'Sin publicaciones activas en la playlist',
    },
    tiktok: {
      title: 'Contenido Corto',
      watch: 'Ver en TikTok',
      btnProfile: 'Perfil de TikTok',
      emptyTitle: 'Sin clips cargados',
    },
    projects: {
      title: 'Desarrollos & Código',
      sourceCode: 'Código',
      liveProject: 'Sitio Web',
      emptyTitle: 'Repositorio en preparación',
    },
    contact: {
      title: 'Contacto',
      directTitle: 'Escríbeme un mensaje',
      emailLabel: 'Correo Electrónico',
      copied: '¡Copiado!',
      copy: 'Copiar',
      responseTime: 'Respuesta estimada: 24 a 48 horas laborales.',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre o empresa',
      emailInputLabel: 'Correo Electrónico',
      emailInputPlaceholder: 'nombre@ejemplo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Detalla tu propuesta o consulta...',
      btnSend: 'Enviar Mensaje',
      btnSent: 'Mensaje Enviado',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      stack: 'Svelte 5 & UnoCSS',
    }
  },
  en: {
    nav: {
      brand: 'LA BESTIA EN LA CUEVA',
      about: 'Home',
      playlist: 'YouTube',
      tiktok: 'TikTok',
      projects: 'Projects',
      contact: 'Contact',
      getInTouch: 'Get in Touch',
    },
    hero: {
      title: 'La Bestia En La Cueva',
      btnExplore: 'Explore Media',
      btnContact: 'Contact',
      socialsHeader: 'Channels & Profiles',
    },
    playlist: {
      title: 'Productions & Series',
      videoCount: 'Available videos',
      videoLabel: 'Video',
      of: 'of',
      views: 'views',
      btnYoutube: 'YouTube Channel',
      emptyTitle: 'No active playlist entries',
    },
    tiktok: {
      title: 'Short Form',
      watch: 'Watch on TikTok',
      btnProfile: 'TikTok Profile',
      emptyTitle: 'No short clips loaded',
    },
    projects: {
      title: 'Engineering & Code',
      sourceCode: 'Code',
      liveProject: 'Live Site',
      emptyTitle: 'Repository in preparation',
    },
    contact: {
      title: 'Contact',
      directTitle: 'Send a message',
      emailLabel: 'Email Address',
      copied: 'Copied!',
      copy: 'Copy',
      responseTime: 'Estimated response time: 24 to 48 business hours.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name or organization',
      emailInputLabel: 'Email Address',
      emailInputPlaceholder: 'name@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Describe your proposal or inquiry...',
      btnSend: 'Send Message',
      btnSent: 'Message Sent',
    },
    footer: {
      rights: 'All rights reserved.',
      stack: 'Svelte 5 & UnoCSS',
    }
  }
};

export type Lang = 'es' | 'en';

function detectInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('vault_lang') as Lang | null;
      if (saved === 'es' || saved === 'en') return saved;
    } catch {}
    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    if (navLang.startsWith('es')) return 'es';
    return 'en';
  }
  return 'es';
}

let currentLang = $state<Lang>(detectInitialLang());

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('vault_lang', lang);
    } catch {}
  }
}

export function toggleLang() {
  setLang(currentLang === 'es' ? 'en' : 'es');
}

export const translations = {
  es: {
    nav: {
      sections: 'Mis secciones',
      about: 'Sobre mí',
      socials: 'Mis redes',
      contact: 'Contacto',
      back: 'Volver',
      lang: 'ES'
    },
    hero: {
      tagline: 'Explora los gustos y disgustos, recomendaciones, reflexiones y todo aquello que he considerado valioso para compartir. Haz scroll para adentrarte en mi cueva.',
      exploreBtn: 'Explorar colecciones'
    },
    about: {
      title: 'Sobre mí',
      p1: 'Soy un encaprichado del aprendizaje y del conocimiento. Mis intereses son, a veces demasiado, variados, aunque siempre he pensado que todo en este universo, y quizás también fuera del mismo, se conecta de una u otra manera. Esto me ha llevado por una inmensidad de caminos a lo largo de mi vida y, si bien sería feliz de compartir lo aprendido, por el momento he considerado más interesante compartir los medios de cómo lo aprendí. De ahí que en esta morada halles los libros, ensayos, vídeos, artículos y diferentes reflexiones que me han construido e influenciado de algún modo.',
      p2: 'Siéntete libre de usar el menú de contacto para sugerirme. Intento leer todo lo que me llega, aunque requeriré tiempo para ello.',
      p3: 'También puedes donar si te gustan las cosas que hago, ya sean mis proyectos de tecnología o lo que publico. Todo lo donado por este medio irá destinado a mejorar el contenido y los proyectos. Puedes revisar el código fuente de este repositorio ',
      clickHere: 'haciendo click aquí.',
      donateBtn: 'Donar en Ko-fi'
    },
    socials: {
      title: 'Mis redes'
    },
    contact: {
      title: 'Contacto',
      recipient: 'Destinatario',
      copyEmail: 'Copiar correo',
      copied: '¡Copiado!',
      nameLabel: 'Nombre o alias',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Tu correo',
      emailPlaceholder: 'tu@correo.com',
      subjectLabel: 'Asunto',
      subjectPlaceholder: 'Propuesta, colaboración, comentario...',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Escribe tu mensaje aquí...',
      sendBtn: 'Enviar mensaje',
      sendingBtn: 'Enviando...',
      sentSuccess: '¡Mensaje enviado con éxito! Te responderé pronto.',
      sendError: 'Hubo un error al enviar. Puedes escribir directamente a'
    },
    player: {
      openYoutube: 'Abrir en YouTube',
      copyLink: 'Copiar enlace',
      copiedLink: '¡Enlace copiado!'
    }
  },
  en: {
    nav: {
      sections: 'My sections',
      about: 'About me',
      socials: 'My socials',
      contact: 'Contact',
      back: 'Back',
      lang: 'EN'
    },
    hero: {
      tagline: 'Explore likes and dislikes, recommendations, reflections, and everything I have deemed worthy of sharing. Scroll to venture into my cave.',
      exploreBtn: 'Explore collections'
    },
    about: {
      title: 'About me',
      p1: 'I am an obsessive pursuer of learning and knowledge. My interests are, at times overly, varied, although I have always believed that everything in this universe, and perhaps outside of it as well, connects in one way or another. This has led me down countless paths throughout my life, and while I would be delighted to share what I have learned, for now I have found it more compelling to share the means through which I learned it. Hence, in this dwelling you will find the books, essays, videos, articles, and varied reflections that have shaped and influenced me.',
      p2: 'Feel free to use the contact menu to send suggestions. I try to read everything that reaches me, though it requires time.',
      p3: 'You can also donate if you like the things I build, whether my tech projects or publications. Everything donated here goes directly towards improving content and projects. You can check out the source code of this repository ',
      clickHere: 'by clicking here.',
      donateBtn: 'Donate on Ko-fi'
    },
    socials: {
      title: 'My socials'
    },
    contact: {
      title: 'Contact',
      recipient: 'Recipient',
      copyEmail: 'Copy email',
      copied: 'Copied!',
      nameLabel: 'Name or alias',
      namePlaceholder: 'Your name',
      emailLabel: 'Your email',
      emailPlaceholder: 'you@email.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Proposal, collaboration, thoughts...',
      messageLabel: 'Message',
      messagePlaceholder: 'Write your message here...',
      sendBtn: 'Send message',
      sendingBtn: 'Sending...',
      sentSuccess: 'Message sent successfully! I will get back to you soon.',
      sendError: 'There was an error sending. You can write directly to'
    },
    player: {
      openYoutube: 'Open on YouTube',
      copyLink: 'Copy link',
      copiedLink: 'Link copied!'
    }
  }
};

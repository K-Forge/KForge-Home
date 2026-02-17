import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'es' | 'en';

const translations: Record<string, Record<Lang, string>> = {
    // ── Nav ──
    'nav.home': { es: 'Inicio', en: 'Home' },
    'nav.about': { es: 'Nosotros', en: 'About' },
    'nav.projects': { es: 'Proyectos', en: 'Projects' },
    'nav.team': { es: 'Equipo', en: 'Team' },
    'nav.contact': { es: 'Contacto', en: 'Contact' },

    // ── Hero ──
    'hero.tagline.pre': { es: 'Donde las Ideas se', en: 'Where Ideas are' },
    'hero.tagline.highlight': { es: 'Forjan', en: 'Forged' },
    'hero.tagline.post': { es: 'en Código', en: 'into Code' },
    'hero.description': {
        es: 'Club universitario de desarrollo de software. Construimos proyectos reales, aprendemos juntos y forjamos el futuro.',
        en: 'University software development club. We build real projects, learn together, and forge the future.',
    },
    'hero.cta.join': { es: 'Unirse al Club', en: 'Join the Club' },
    'hero.cta.projects': { es: 'Ver Proyectos', en: 'See Projects' },
    'hero.scroll': { es: 'Desliza', en: 'Scroll' },

    // ── About ──
    'about.title': { es: 'Nosotros', en: 'About Us' },
    'about.subtitle': {
        es: 'Tres pilares que definen quiénes somos, qué hacemos y cómo lo hacemos.',
        en: 'Three pillars that define who we are, what we do, and how we do it.',
    },

    // 1 · El Porqué
    'about.why.tag': { es: 'Nuestra motivación', en: 'Our motivation' },
    'about.why.title': { es: 'Más allá del aula', en: 'Beyond the classroom' },
    'about.why.tagline': {
        es: 'K-Forge busca retarnos a nosotros mismos.',
        en: 'K-Forge seeks to challenge ourselves.',
    },
    'about.why.desc': {
        es: 'Somos un grupo de estudiantes que decidió no quedarse solo con lo que vemos en clase. Nuestra razón de ser es simple: queremos construir cosas, probar nuestras ideas y ver hasta dónde podemos llevar nuestra curiosidad técnica en un espacio libre y personal.',
        en: 'We are a group of students who decided not to stick only with what we see in class. Our purpose is simple: we want to build things, test our ideas, and see how far we can take our technical curiosity in a free and personal space.',
    },

    // 2 · El Qué
    'about.what.tag': { es: 'De la práctica al portfolio', en: 'From practice to portfolio' },
    'about.what.title': { es: 'Proyectos que evolucionan', en: 'Evolving projects' },
    'about.what.tagline': {
        es: 'Todo lo que hacemos nace como un ejercicio o una idea pequeña.',
        en: 'Everything we do starts as an exercise or a small idea.',
    },
    'about.what.desc': {
        es: 'Lo que empieza como una práctica para entender una tecnología, lo iteramos hasta convertirlo en un proyecto sólido para nuestro portfolio o incluso para un uso real.',
        en: 'What starts as a practice to understand a technology, we iterate on until it becomes a solid project for our portfolio or even for real use.',
    },

    // 3 · El Cómo
    'about.how.tag': { es: 'Crecimiento en comunidad', en: 'Growth in community' },
    'about.how.title': { es: 'Aprendizaje entre pares', en: 'Peer learning' },
    'about.how.tagline': {
        es: 'Trabajamos juntos porque nos gusta compartir lo que sabemos.',
        en: 'We work together because we like to share what we know.',
    },
    'about.how.desc': {
        es: 'Mostramos nuestros avances, recibimos opiniones de los demás compañeros y nos damos retroalimentación para mejorar. Es un espacio de colaboración espontánea donde el objetivo es que todos subamos nuestro nivel técnico mientras construimos algo interesante.',
        en: 'We show our progress, receive opinions from other colleagues, and give each other feedback to improve. It is a space for spontaneous collaboration where the goal is for everyone to raise our technical level while building something interesting.',
    },

    // ── Projects ──
    'projects.title': { es: 'Proyectos', en: 'Projects' },
    'projects.subtitle': {
        es: 'Proyectos forjados con pasión, código y trabajo en equipo.',
        en: 'Projects forged with passion, code, and teamwork.',
    },
    'projects.noDesc': { es: 'Sin descripción disponible', en: 'No description available' },
    'projects.viewCode': { es: 'Ver Código', en: 'View Code' },
    'projects.viewLive': { es: 'Ver en Vivo', en: 'View Live' },
    'projects.viewMore': { es: 'Ver más en GitHub', en: 'See more on GitHub' },
    'projects.error': { es: 'Error al cargar proyectos', en: 'Error loading projects' },
    'projects.errorTitle': { es: 'No pudimos cargar los proyectos ahora mismo', en: 'We could not load projects right now' },
    'projects.errorUnavailable': {
        es: 'La API de GitHub está respondiendo lento o temporalmente no disponible. Puedes volver a intentar en unos minutos.',
        en: 'The GitHub API is currently slow or temporarily unavailable. You can try again in a few minutes.',
    },
    'projects.errorRateLimit': {
        es: 'Llegamos al límite temporal de la API de GitHub. Intenta nuevamente en unos minutos.',
        en: 'We hit the temporary GitHub API rate limit. Please try again in a few minutes.',
    },
    'projects.errorCta': { es: 'Ver repositorio de K-FORGE', en: 'View K-FORGE repository' },
    'projects.retry': { es: 'Reintentar', en: 'Retry' },
    'projects.empty': { es: 'No se encontraron proyectos.', en: 'No projects found.' },

    // ── Team ──
    'team.title': { es: 'Equipo', en: 'Team' },
    'team.subtitle': {
        es: 'Las personas detrás de cada línea de código.',
        en: 'The people behind every line of code.',
    },
    'team.member': { es: 'Miembro', en: 'Member' },
    'team.projects': { es: 'Proyectos', en: 'Projects' },
    'team.commits': { es: 'commits', en: 'commits' },
    'team.lastActivity': { es: 'Última actividad en el club', en: 'Last activity in the club' },
    'team.noProjects': { es: 'Sin proyectos registrados en K-Forge', en: 'No registered projects in K-Forge' },
    'team.noActivity': { es: 'Sin actividad reciente', en: 'No recent activity' },
    'team.error': { es: 'No se pudo cargar el equipo.', en: 'Could not load the team.' },
    'team.errorTitle': { es: 'No pudimos cargar el equipo ahora mismo', en: 'We could not load the team right now' },
    'team.errorUnavailable': {
        es: 'La API de GitHub está respondiendo lento o temporalmente no disponible. Puedes volver a intentar en unos minutos.',
        en: 'The GitHub API is currently slow or temporarily unavailable. You can try again in a few minutes.',
    },
    'team.errorRateLimit': {
        es: 'Llegamos al límite temporal de la API de GitHub. Intenta nuevamente en unos minutos.',
        en: 'We hit the temporary GitHub API rate limit. Please try again in a few minutes.',
    },
    'team.errorCta': { es: 'Ver repositorio de K-FORGE', en: 'View K-FORGE repository' },
    'team.retry': { es: 'Reintentar', en: 'Retry' },
    'team.empty': { es: 'No se encontraron integrantes del equipo.', en: 'No team members found.' },

    // ── Contact ──
    'contact.title': { es: 'Contacto', en: 'Contact' },
    'contact.subtitle': { es: '¿Quieres unirte o colaborar? Escríbenos.', en: 'Want to join or collaborate? Write to us.' },
    'contact.name': { es: 'Nombre', en: 'Name' },
    'contact.name.placeholder': { es: 'Tu nombre', en: 'Your name' },
    'contact.email': { es: 'Email', en: 'Email' },
    'contact.email.placeholder': { es: 'tu@email.com', en: 'you@email.com' },
    'contact.message': { es: 'Mensaje', en: 'Message' },
    'contact.message.placeholder': { es: 'Cuéntanos qué tienes en mente...', en: 'Tell us what you have in mind...' },
    'contact.submit': { es: 'Enviar Mensaje', en: 'Send Message' },
    'contact.sending': { es: 'Enviando...', en: 'Sending...' },
    'contact.success.title': { es: '¡Mensaje enviado!', en: 'Message sent!' },
    'contact.success.subtitle': { es: 'Te responderemos pronto.', en: 'We\'ll get back to you soon.' },
    'contact.success.another': { es: 'Enviar otro mensaje', en: 'Send another message' },
    'contact.error.title': { es: 'Error al enviar', en: 'Error sending' },
    'contact.error.subtitle': { es: 'Inténtalo de nuevo.', en: 'Please try again.' },
    'contact.error.retry': { es: 'Reintentar', en: 'Retry' },

    // ── Footer ──
    'footer.tagline': { es: 'Club de Desarrollo de Software', en: 'Software Development Club' },
    'footer.contact': { es: 'Contacto', en: 'Contact' },
    'footer.toTop': { es: 'Volver arriba', en: 'Back to top' },
    'footer.madeBy': { es: 'Hecho por', en: 'Made by' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
    private _lang = signal<Lang>(this.detectLang());

    lang = this._lang.asReadonly();

    t(key: string): string {
        const entry = translations[key];
        if (!entry) return key;
        return entry[this._lang()] ?? entry['es'] ?? key;
    }

    toggleLang(): void {
        this._lang.update(l => l === 'es' ? 'en' : 'es');
        localStorage.setItem('kforge-lang', this._lang());
    }

    setLang(lang: Lang): void {
        this._lang.set(lang);
        localStorage.setItem('kforge-lang', lang);
    }

    private detectLang(): Lang {
        const stored = localStorage.getItem('kforge-lang') as Lang | null;
        if (stored === 'es' || stored === 'en') return stored;
        const nav = navigator.language?.slice(0, 2);
        return nav === 'en' ? 'en' : 'es';
    }
}

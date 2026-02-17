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
        es: 'Un espacio donde estudiantes apasionados construyen el futuro, juntos.',
        en: 'A space where passionate students build the future, together.',
    },
    'about.mission.title': { es: 'Nuestra Misión', en: 'Our Mission' },
    'about.mission.desc': {
        es: 'Crear un puente entre el aula y la industria. Desarrollamos proyectos reales con tecnologías actuales para preparar estudiantes que marquen la diferencia.',
        en: 'Bridging the gap between the classroom and industry. We build real projects with modern technologies to prepare students who make a difference.',
    },
    'about.what.title': { es: 'Qué Hacemos', en: 'What We Do' },
    'about.what.desc': {
        es: 'Desarrollamos software en equipo: aplicaciones web, móviles, APIs y más. Organizamos workshops, hackathons y sesiones de code review semanales.',
        en: 'We develop software as a team: web apps, mobile apps, APIs and more. We organize workshops, hackathons, and weekly code review sessions.',
    },
    'about.why.title': { es: 'Por Qué Unirte', en: 'Why Join' },
    'about.why.desc': {
        es: 'Portfolio real con proyectos colaborativos, networking con la industria, mentoría entre pares y un ambiente donde aprender haciendo es la norma.',
        en: 'Real portfolio with collaborative projects, industry networking, peer mentorship, and an environment where learning by doing is the norm.',
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
    'team.retry': { es: 'Reintentar', en: 'Retry' },
    'team.empty': { es: 'Próximamente — el equipo está en formación.', en: 'Coming soon — the team is forming.' },

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

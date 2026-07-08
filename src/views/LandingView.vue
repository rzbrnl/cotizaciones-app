<template>
  <div class="landing">
    <!-- Header -->
    <header class="landing-header">
      <div class="header-content">
        <router-link to="/" class="header-logo">CotizaYa by Vēlum</router-link>
        <nav class="header-nav">
          <button class="theme-toggle" @click="themeStore.toggle" :title="themeStore.isDark ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="themeStore.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <router-link to="/login" class="header-link-icon" title="Iniciar sesión">
            <HIcon name="login" :size="20" />
          </router-link>
          <router-link to="/registro" class="header-btn">Comenzar gratis</router-link>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">✨ Diseñado para organizadores de eventos</div>
        <h1>La forma más rápida de cotizar eventos y cerrar más clientes</h1>
        <p class="hero-subtitle">
          Crea cotizaciones profesionales, compártelas por WhatsApp, recibe aprobaciones y administra los pagos de cada evento desde un solo lugar.
        </p>
        <div class="hero-actions">
          <router-link to="/registro" class="btn-primary">Comenzar gratis</router-link>
          <router-link to="/login" class="btn-secondary">Ya tengo cuenta</router-link>
        </div>
        <div class="hero-benefits">
          <span class="hero-benefit">✓ Comparte por WhatsApp</span>
          <span class="hero-benefit">✓ Aprobación online</span>
          <span class="hero-benefit">✓ Pagos por etapas</span>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-mockup">
          <div class="mockup-header">
            <div class="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="mockup-title">CotizaYa by Vēlum</span>
          </div>
          <div class="mockup-body">
            <div class="mockup-nav">
              <span class="mockup-nav-item active">Dashboard</span>
              <span class="mockup-nav-item">Calendario</span>
            </div>
            <div class="mockup-content">
              <div class="mockup-card">
                <div class="mockup-card-header">
                  <span>Boda García López</span>
                  <span class="mockup-badge approved">Aprobada</span>
                </div>
                <div class="mockup-card-body">
                  <div class="mockup-row">
                    <span>Venue: Salón Events</span>
                    <span class="mockup-price">$45,000</span>
                  </div>
                  <div class="mockup-progress">
                    <div class="mockup-progress-bar" style="width: 60%"></div>
                  </div>
                  <span class="mockup-progress-text">2/3 etapas pagadas</span>
                </div>
              </div>
              <div class="mockup-card">
                <div class="mockup-card-header">
                  <span>XV Años María</span>
                  <span class="mockup-badge pending">Pendiente</span>
                </div>
                <div class="mockup-card-body">
                  <div class="mockup-row">
                    <span>Venue: Jardín Elegance</span>
                    <span class="mockup-price">$28,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="section-container">
        <div class="section-header">
          <h2>Todo lo que necesitas para vender más eventos</h2>
          <p>Herramientas diseñadas para que te enfoques en lo que mejor haces: crear experiencias inolvidables</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3>Cotizaciones profesionales</h3>
            <p>Crea propuestas con una presentación impecable que genere confianza desde el primer momento</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <h3>Comparte por WhatsApp</h3>
            <p>Envía tu cotización en segundos y evita descargar, adjuntar y volver a enviar archivos</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3>Pagos por etapas</h3>
            <p>Define anticipos y pagos pendientes para que tus clientes siempre sepan cuánto pagar y cuándo hacerlo</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Aprobación online</h3>
            <p>El cliente puede aceptar o rechazar la propuesta desde cualquier dispositivo</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Calendario</h3>
            <p>Mantén todos tus eventos organizados y evita fechas duplicadas</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Seguro y privado</h3>
            <p>Cada negocio administra únicamente su información y la de sus clientes</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ideal para -->
    <section class="ideal-for">
      <div class="section-container">
        <div class="section-header">
          <h2>Ideal para</h2>
          <p>Si organizas, decoras, fotografias o provees servicios para eventos, CotizaYa es para ti</p>
        </div>
        <div class="ideal-grid">
          <div class="ideal-item" v-for="item in idealFor" :key="item">
            <span class="ideal-icon">◆</span>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison -->
    <section class="comparison">
      <div class="section-container">
        <div class="section-header">
          <h2>Deja atrás las cotizaciones complicadas</h2>
          <p>Compara el proceso tradicional con CotizaYa</p>
        </div>
        <div class="comparison-grid">
          <div class="comparison-card before">
            <div class="comparison-label">Antes</div>
            <ul class="comparison-list">
              <li><span class="comparison-icon">✕</span> Word y Excel</li>
              <li><span class="comparison-icon">✕</span> PDFs enviados por correo</li>
              <li><span class="comparison-icon">✕</span> Confirmaciones por llamada</li>
              <li><span class="comparison-icon">✕</span> Seguimiento manual</li>
              <li><span class="comparison-icon">✕</span> Cálculos a mano</li>
            </ul>
          </div>
          <div class="comparison-card after">
            <div class="comparison-label">Con CotizaYa</div>
            <ul class="comparison-list">
              <li><span class="comparison-icon">✓</span> Cotizaciones profesionales</li>
              <li><span class="comparison-icon">✓</span> Comparte por WhatsApp</li>
              <li><span class="comparison-icon">✓</span> Aprobación en línea</li>
              <li><span class="comparison-icon">✓</span> Seguimiento organizado</li>
              <li><span class="comparison-icon">✓</span> Cálculos automáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <div class="section-container">
        <div class="section-header">
          <h2>¿Cómo funciona?</h2>
          <p>De cotización a cobro en cuatro pasos simples</p>
        </div>
        <div class="steps-flow">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Crea tu cotización</h3>
              <p>Agrega conceptos, precios y datos del cliente en segundos</p>
            </div>
          </div>
          <div class="step-connector">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Compártela por WhatsApp</h3>
              <p>Envía la cotización con un solo clic</p>
            </div>
          </div>
          <div class="step-connector">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Tu cliente la aprueba</h3>
              <p>Desde su celular, sin necesidad de registrarse</p>
            </div>
          </div>
          <div class="step-connector">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Recibe el pago</h3>
              <p>Por etapas, con recordatorios automáticos</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlight -->
    <section class="highlight">
      <div class="section-container">
        <div class="highlight-content">
          <div class="highlight-text">
            <h2>Más tiempo para crear, menos tiempo para cobrar</h2>
            <p>CotizaYa automatiza el proceso de cotización y cobro para que te enfoques en lo que mejor haces: crear experiencias memorables para tus clientes.</p>
            <div class="highlight-stats">
              <div class="highlight-stat">
                <span class="highlight-stat-value">3 min</span>
                <span class="highlight-stat-label">Para crear una cotización</span>
              </div>
              <div class="highlight-stat">
                <span class="highlight-stat-value">1 clic</span>
                <span class="highlight-stat-label">Para compartirla</span>
              </div>
              <div class="highlight-stat">
                <span class="highlight-stat-value">24h</span>
                <span class="highlight-stat-label">Tiempo promedio de respuesta</span>
              </div>
            </div>
          </div>
          <div class="highlight-visual">
            <div class="highlight-phone">
              <div class="phone-screen">
                <div class="phone-statusbar">
                  <span>11:19</span>
                  <span class="phone-icons">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                  </span>
                </div>
                <div class="phone-chat-header">
                  <span class="phone-back">‹</span>
                  <div class="phone-contact">
                    <span class="phone-contact-name">María García</span>
                    <span class="phone-contact-status">en línea</span>
                  </div>
                </div>
                <div class="phone-chat-bg">
                  <div class="phone-message-bubble outgoing">
                    <div class="phone-msg-text">
                      <span class="phone-emoji">✨</span> <strong>Cotización aprobada</strong><br><br>
                      Hola María,<br><br>
                      Tu cotización ha sido aprobada. Los datos para el depósito:<br><br>
                      <span class="phone-emoji">📅</span> <strong>Evento:</strong> Boda<br>
                      <span class="phone-emoji">📍</span> <strong>Venue:</strong> Salón Events<br>
                      <span class="phone-emoji">💰</span> <strong>Total:</strong> $45,000 MXN<br><br>
                      ━━━━━━━━━━━━━━━<br><br>
                      <span class="phone-emoji">🏦</span> <strong>Datos de pago:</strong><br><br>
                      <strong>Banco:</strong> BBVA<br>
                      <strong>CLABE:</strong> 012345678901234567<br>
                      <strong>Titular:</strong> Josué Eventos<br><br>
                      <span class="phone-emoji">📝</span> <strong>Anticipo:</strong> $22,500<br><br>
                      Envíame el comprobante 🙏<br><br>
                      Saludos,<br>Josué
                    </div>
                    <div class="phone-msg-time">3:49 p.m. ✓✓</div>
                  </div>
                  <div class="phone-message-bubble incoming">
                    <div class="phone-msg-text">
                      ¡Listo Josué! Ya hice el depósito del anticipo, te envío el comprobante 📸
                    </div>
                    <div class="phone-msg-time">4:12 p.m.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="section-container">
        <div class="section-header">
          <h2>Preguntas frecuentes</h2>
        </div>
        <div class="faq-grid">
          <div class="faq-item" v-for="faq in faqs" :key="faq.q">
            <h3>{{ faq.q }}</h3>
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="section-container">
        <div class="cta-content">
          <h2>Empieza hoy mismo</h2>
          <p>Haz tu primera cotización en menos de cinco minutos y descubre una forma más profesional de vender tus servicios.</p>
          <router-link to="/registro" class="btn-primary btn-large">Crear mi cuenta gratis</router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">CotizaYa by Vēlum</span>
          <p class="footer-tagline">Cotizaciones profesionales para organizadores de eventos</p>
        </div>
        <div class="footer-links">
          <router-link to="/login">Iniciar sesión</router-link>
          <router-link to="/registro">Crear cuenta</router-link>
        </div>
        <div class="footer-copyright">
          © 2026 CotizaYa by Vēlum. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useThemeStore } from '../stores/theme'
import HIcon from '../components/HIcon.vue'

const themeStore = useThemeStore()

const idealFor = [
  'Wedding Planners',
  'Decoradores',
  'Floristas',
  'Banquetes',
  'Fotógrafos',
  'Videógrafos',
  'DJs',
  'Coordinadores de eventos',
  'Salones de eventos',
  'Rentas de mobiliario',
  'Pastelerías',
  'Invitaciones digitales',
]

const faqs = [
  { q: '¿Tiene costo?', a: 'No, puedes crear tu cuenta y empezar a cotizar gratis. No hay límite de cotizaciones.' },
  { q: '¿Puedo usar mi logo?', a: 'Sí, sube tu logo desde tu perfil y aparecerá en todas tus cotizaciones.' },
  { q: '¿Mi cliente necesita registrarse?', a: 'No, tu cliente recibe un enlace y puede aprobar o rechazar la cotización sin crear cuenta.' },
  { q: '¿Cómo recibe la cotización?', a: 'Le envías el enlace por WhatsApp con un solo clic, o puedes copiarlo y enviarlo por cualquier medio.' },
  { q: '¿Puedo modificar una cotización enviada?', a: 'Sí, puedes editar cualquier cotización en cualquier momento desde tu dashboard.' },
  { q: '¿Puedo cobrar anticipos?', a: 'Sí, define etapas de pago (anticipo, parcial, final) y el sistema lleva el control automáticamente.' },
  { q: '¿Funciona desde el celular?', a: 'Sí, CotizaYa está optimizado para funcionar desde cualquier dispositivo, incluido el celular.' },
  { q: '¿Hay límite de cotizaciones?', a: 'No, puedes crear todas las cotizaciones que necesites sin ningún límite.' },
]
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--white);
}

/* Header */
.landing-header {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  text-decoration: none;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-link-icon {
  color: var(--gray-text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.header-link-icon:hover {
  color: var(--black);
  background: rgba(0,0,0,0.05);
}

.header-btn {
  display: inline-block;
  background: var(--black);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.header-btn:hover {
  background: #4a4a4a;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--gray-text);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: var(--black);
  background: rgba(0,0,0,0.05);
}

/* Section Container */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
}

.hero-content {
  flex: 1;
  max-width: 560px;
}

.hero-badge {
  display: inline-block;
  background: rgba(201, 168, 106, 0.1);
  color: var(--gold);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--black);
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--gray-text);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.btn-primary {
  display: inline-block;
  background: var(--gold);
  color: var(--white);
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #b8944d;
}

.btn-secondary {
  display: inline-block;
  background: none;
  border: 1px solid var(--gray-border);
  color: var(--black);
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--black);
}

.hero-benefits {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-benefit {
  font-size: 0.85rem;
  color: var(--gray-text);
}

/* Hero Mockup */
.hero-visual {
  flex: 1;
  max-width: 500px;
}

.hero-mockup {
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.mockup-header {
  background: #f9fafb;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.mockup-dots {
  display: flex;
  gap: 6px;
}

.mockup-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e5e7eb;
}

.mockup-dots span:first-child { background: #ef4444; }
.mockup-dots span:nth-child(2) { background: #f59e0b; }
.mockup-dots span:last-child { background: #10b981; }

.mockup-title {
  font-size: 0.75rem;
  color: var(--gray-text);
  font-weight: 500;
}

.mockup-body {
  padding: 16px;
}

.mockup-nav {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.mockup-nav-item {
  font-size: 0.75rem;
  color: var(--gray-text);
  font-weight: 500;
}

.mockup-nav-item.active {
  color: var(--black);
  border-bottom: 2px solid var(--gold);
  padding-bottom: 2px;
}

.mockup-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mockup-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 14px;
}

.mockup-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--black);
}

.mockup-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.mockup-badge.approved {
  background: #dcfce7;
  color: #16a34a;
}

.mockup-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.mockup-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--gray-text);
  margin-bottom: 8px;
}

.mockup-price {
  font-weight: 600;
  color: var(--gold);
}

.mockup-progress {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.mockup-progress-bar {
  height: 100%;
  background: #16a34a;
  border-radius: 2px;
}

.mockup-progress-text {
  font-size: 0.7rem;
  color: #16a34a;
}

/* Features */
.features {
  padding: 100px 0;
  background: #f9fafb;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 12px;
}

.section-header p {
  font-size: 1rem;
  color: var(--gray-text);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(201, 168, 106, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--gray-text);
  line-height: 1.5;
}

/* Ideal For */
.ideal-for {
  padding: 100px 0;
}

.ideal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.ideal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f9fafb;
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--black);
  transition: all 0.2s;
}

.ideal-item:hover {
  background: rgba(201, 168, 106, 0.1);
  transform: translateY(-2px);
}

.ideal-icon {
  color: var(--gold);
  font-size: 0.8rem;
}

/* Comparison */
.comparison {
  padding: 100px 0;
  background: #f9fafb;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.comparison-card {
  background: var(--white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.comparison-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid;
}

.comparison-card.before .comparison-label {
  color: #9ca3af;
  border-color: #e5e7eb;
}

.comparison-card.after .comparison-label {
  color: var(--gold);
  border-color: var(--gold);
}

.comparison-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comparison-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9rem;
  color: var(--black);
  border-bottom: 1px solid #f0f0f0;
}

.comparison-list li:last-child {
  border-bottom: none;
}

.comparison-icon {
  font-weight: 700;
  font-size: 1rem;
}

.comparison-card.before .comparison-icon {
  color: #9ca3af;
}

.comparison-card.after .comparison-icon {
  color: #16a34a;
}

/* How it works */
.how-it-works {
  padding: 100px 0;
}

.steps-flow {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.step {
  flex: 1;
  max-width: 220px;
  text-align: center;
}

.step-number {
  width: 56px;
  height: 56px;
  background: var(--gold);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 auto 16px;
}

.step-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.step-content p {
  font-size: 0.85rem;
  color: var(--gray-text);
}

.step-connector {
  color: #d1d5db;
  margin-top: 20px;
  flex-shrink: 0;
}

/* Highlight */
.highlight {
  padding: 100px 0;
  background: #f9fafb;
}

.highlight-content {
  display: flex;
  align-items: center;
  gap: 60px;
}

.highlight-text {
  flex: 1;
}

.highlight-text h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 16px;
}

.highlight-text p {
  font-size: 1rem;
  color: var(--gray-text);
  line-height: 1.6;
  margin-bottom: 32px;
}

.highlight-stats {
  display: flex;
  gap: 40px;
}

.highlight-stat {
  display: flex;
  flex-direction: column;
}

.highlight-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--gold);
}

.highlight-stat-label {
  font-size: 0.8rem;
  color: var(--gray-text);
}

.highlight-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.highlight-phone {
  width: 300px;
  background: #1a1a1a;
  border-radius: 28px;
  padding: 10px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

.phone-screen {
  background: #efeae2;
  border-radius: 20px;
  overflow: hidden;
}

.phone-statusbar {
  background: #f0f2f5;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: #1a1a1a;
  font-weight: 500;
}

.phone-icons {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #1a1a1a;
}

.phone-chat-header {
  background: #f0f2f5;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.phone-back {
  font-size: 1.2rem;
  color: #1a1a1a;
  font-weight: 300;
}

.phone-contact {
  display: flex;
  flex-direction: column;
}

.phone-contact-name {
  font-size: 0.8rem;
  color: #1a1a1a;
  font-weight: 500;
}

.phone-contact-status {
  font-size: 0.65rem;
  color: #667781;
}

.phone-chat-bg {
  background: #efeae2;
  padding: 12px;
  min-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phone-message-bubble {
  border-radius: 8px 8px 0 8px;
  padding: 8px 10px;
  max-width: 88%;
  clear: both;
  position: relative;
}

.phone-message-bubble.outgoing {
  background: #d9fdd3;
  border-radius: 8px 8px 0 8px;
  align-self: flex-end;
}

.phone-message-bubble.incoming {
  background: #ffffff;
  border-radius: 8px 8px 8px 0;
  align-self: flex-start;
}

.phone-msg-text {
  font-size: 0.72rem;
  line-height: 1.45;
  color: #111b21;
  word-wrap: break-word;
}

.phone-msg-text strong {
  color: #111b21;
}

.phone-emoji {
  font-size: 0.8rem;
}

.phone-msg-time {
  font-size: 0.6rem;
  color: #667781;
  text-align: right;
  margin-top: 4px;
}

/* FAQ */
.faq {
  padding: 100px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.faq-item {
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
}

.faq-item h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 8px;
}

.faq-item p {
  font-size: 0.88rem;
  color: var(--gray-text);
  line-height: 1.5;
}

/* CTA */
.cta {
  padding: 100px 0;
  background: var(--black);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
}

.cta p {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 32px;
  line-height: 1.6;
}

.btn-large {
  padding: 16px 40px;
  font-size: 1rem;
}

/* Footer */
.footer {
  background: #111;
  padding: 60px 40px 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--white);
}

.footer-tagline {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  margin-top: 8px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
}

.footer-links a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--white);
}

.footer-copyright {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
}

/* Responsive */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 60px 24px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-benefits {
    justify-content: center;
  }

  .hero-visual {
    max-width: 100%;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .ideal-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .steps-flow {
    flex-direction: column;
    align-items: center;
  }

  .step-connector {
    transform: rotate(90deg);
  }

  .highlight-content {
    flex-direction: column;
    text-align: center;
  }

  .highlight-stats {
    justify-content: center;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .cta h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 12px 16px;
    gap: 8px;
  }

  .header-logo {
    font-size: 0.85rem;
  }

  .header-nav {
    gap: 8px;
  }

  .header-btn {
    padding: 8px 16px;
    font-size: 0.75rem;
  }

  .ideal-grid {
    grid-template-columns: 1fr;
  }
}
</style>

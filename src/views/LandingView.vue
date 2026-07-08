<template>
  <div class="landing">
    <!-- Header -->
    <header class="landing-header">
      <div class="header-content">
        <router-link to="/" class="header-logo">CotizaYa by Vēlum</router-link>
        <nav class="header-nav">
          <button
            class="theme-toggle"
            @click="themeStore.toggle"
            :title="themeStore.isDark ? 'Modo claro' : 'Modo oscuro'"
          >
            <svg
              v-if="themeStore.isDark"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <router-link to="/login" class="header-link-icon" title="Iniciar sesión">
            <HIcon name="login" :size="18" />
          </router-link>
          <router-link to="/registro" class="header-btn"
            >Comenzar gratis</router-link
          >
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">Para organizadores de eventos</div>
        <h1>Crea cotizaciones profesionales en minutos</h1>
        <p class="hero-subtitle">
          Simplifica el proceso de cotizar, comparte con tus clientes y recibe
          pagos más rápido. Todo desde un solo lugar.
        </p>
        <div class="hero-actions">
          <router-link to="/registro" class="btn-primary"
            >Comenzar gratis</router-link
          >
          <router-link to="/login" class="btn-secondary"
            >Ya tengo cuenta</router-link
          >
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">500+</span>
            <span class="stat-label">Cotizaciones creadas</span>
          </div>
          <div class="stat">
            <span class="stat-value">98%</span>
            <span class="stat-label">Satisfacción</span>
          </div>
          <div class="stat">
            <span class="stat-value">24h</span>
            <span class="stat-label">Respuesta promedio</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">
          <div class="hero-card-header">
            <span>Cotización</span>
            <span class="hero-card-date">3 julio 2026</span>
          </div>
          <div class="hero-card-body">
            <div class="hero-card-row">
              <span>Boda García López</span>
              <span class="hero-card-price">$45,000</span>
            </div>
            <div class="hero-card-status">
              <span class="status-dot approved"></span>
              Aprobada
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="section-header">
        <h2>Todo lo que necesitas para cotizar</h2>
        <p>
          Herramientas diseñadas para organizadores de eventos profesionales
        </p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3>Cotizaciones profesionales</h3>
          <p>
            Crea cotizaciones elegantes con tu logo, datos del cliente y
            desglose de conceptos
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              />
            </svg>
          </div>
          <h3>Comparte por WhatsApp</h3>
          <p>
            Envía cotizaciones directamente por WhatsApp con un clic. Sin copiar
            ni pegar
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>Pagos por etapas</h3>
          <p>
            Divide los pagos en anticipos y restantes. Envía recordatorios
            automáticos
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>Aprobación del cliente</h3>
          <p>
            Tu cliente puede aprobar o rechazar la cotización desde una página
            pública
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>Calendario de eventos</h3>
          <p>
            Visualiza todos tus eventos en un calendario. Nunca pierdas una
            fecha importante
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>Seguro y privado</h3>
          <p>
            Tus datos están protegidos. Cada usuario solo ve sus propias
            cotizaciones
          </p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <div class="section-header">
        <h2>¿Cómo funciona?</h2>
        <p>Tres pasos simples para empezar a cotizar</p>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Crea tu cotización</h3>
          <p>
            Agrega los conceptos, precios y datos de tu cliente en el builder
            intuitivo
          </p>
        </div>
        <div class="step-arrow">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Comparte con tu cliente</h3>
          <p>
            Envía por WhatsApp o comparte el enlace público para que apruebe
          </p>
        </div>
        <div class="step-arrow">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Recibe el pago</h3>
          <p>
            El cliente paga por etapas y tú recibes notificaciones automáticas
          </p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="section-header">
        <h2>Lo que dicen nuestros usuarios</h2>
        <p>Organizadores de eventos que ya confían en CotizaYa</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">
            "Antes tardaba 2 horas en hacer cada cotización. Ahora lo hago en 15
            minutos y mis clientes aprueban más rápido"
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">ML</div>
            <div class="author-info">
              <span class="author-name">María López</span>
              <span class="author-role">Organizadora de bodas</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">
            "El sistema de pagos por etapas me ayudó a cobrar más rápido. Mis
            clientes entienden mejor cuándo pagar"
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">CR</div>
            <div class="author-info">
              <span class="author-name">Carlos Ramírez</span>
              <span class="author-role">Decorador de eventos</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">
            "Lo mejor es poder compartir por WhatsApp. Mis clientes responden
            más rápido y cierro más ventas"
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">AS</div>
            <div class="author-info">
              <span class="author-name">Ana Sánchez</span>
              <span class="author-role">Florista profesional</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-content">
        <h2>¿Listo para empezar a cotizar?</h2>
        <p>Crea tu primera cotización gratis en menos de 5 minutos</p>
        <router-link to="/registro" class="btn-primary btn-large"
          >Comenzar gratis</router-link
        >
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">CotizaYa by Vēlum</span>
          <p class="footer-tagline">
            Cotizaciones profesionales para organizadores de eventos
          </p>
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
import { useThemeStore } from "../stores/theme";
import HIcon from "../components/HIcon.vue";

const themeStore = useThemeStore();
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
  background: rgba(255, 255, 255, 0.5);
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

.header-link {
  font-size: 0.9rem;
  color: var(--gray-text);
  text-decoration: none;
  transition: color 0.2s;
}

.header-link:hover {
  color: var(--black);
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
  background: rgba(0, 0, 0, 0.05);
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
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--black);
  line-height: 1.2;
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
  margin-bottom: 40px;
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

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gold);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--gray-text);
}

.hero-visual {
  flex: 1;
  max-width: 400px;
}

.hero-card {
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.hero-card-header {
  background: var(--black);
  padding: 24px;
  color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
}

.hero-card-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.hero-card-body {
  padding: 24px;
}

.hero-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hero-card-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gold);
}

.hero-card-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #16a34a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #16a34a;
}

/* Features */
.features {
  background: #f9fafb;
  padding: 100px 40px;
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
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
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

/* How it works */
.how-it-works {
  padding: 100px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.step {
  flex: 1;
  max-width: 280px;
  text-align: center;
  padding: 32px 24px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: var(--gold);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
}

.step h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 8px;
}

.step p {
  font-size: 0.9rem;
  color: var(--gray-text);
}

.step-arrow {
  color: #ccc;
  flex-shrink: 0;
}

/* Testimonials */
.testimonials {
  background: #f9fafb;
  padding: 100px 40px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: var(--white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.testimonial-stars {
  color: var(--gold);
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.testimonial-text {
  font-size: 0.95rem;
  color: var(--black);
  line-height: 1.6;
  margin-bottom: 20px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  background: var(--gold);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.author-name {
  display: block;
  font-weight: 600;
  color: var(--black);
  font-size: 0.9rem;
}

.author-role {
  font-size: 0.8rem;
  color: var(--gray-text);
}

/* CTA */
.cta {
  background: var(--black);
  padding: 100px 40px;
  text-align: center;
}

.cta-content {
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
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
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
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--white);
}

.footer-copyright {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
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

  .hero-stats {
    justify-content: center;
  }

  .hero-visual {
    max-width: 100%;
  }

  .features-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    flex-direction: column;
  }

  .step-arrow {
    transform: rotate(90deg);
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
    padding: 6px 12px;
    font-size: 0.75rem;
  }
}
</style>

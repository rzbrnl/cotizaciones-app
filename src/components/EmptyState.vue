<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    </div>
    <h2>No hay cotizaciones</h2>
    <p>Crea tu primera cotización para comenzar</p>
    <router-link to="/nueva" class="empty-btn">Crear mi primer cotización</router-link>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  color: #999;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 0.9rem;
  color: var(--gray-text);
  margin-bottom: 28px;
}

.empty-btn {
  display: inline-block;
  background: var(--black);
  color: var(--white);
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.empty-btn:hover {
  opacity: 0.9;
}
</style>

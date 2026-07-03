<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button class="cal-nav" @click="prevMonth">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h3 class="cal-month">{{ monthLabel }}</h3>
      <button class="cal-nav" @click="nextMonth">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="cal-weekday">{{ day }}</div>
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="cal-day"
        :class="{
          'other-month': !day.currentMonth,
          'today': day.isToday,
          'has-events': day.events.length > 0
        }"
      >
        <span class="cal-day-number">{{ day.date }}</span>
        <div v-if="day.events.length > 0" class="cal-events">
          <div
            v-for="event in day.events.slice(0, 2)"
            :key="event.id"
            class="cal-event"
            :class="event.status"
            @click="$emit('select', event.id)"
          >
            {{ event.clientName || 'Sin cliente' }}
          </div>
          <div v-if="day.events.length > 2" class="cal-more">
            +{{ day.events.length - 2 }} más
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming events -->
    <div v-if="upcomingEvents.length > 0" class="upcoming-section">
      <h4>Próximos eventos</h4>
      <div class="upcoming-list">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="upcoming-item"
          @click="$emit('select', event.id)"
        >
          <div class="upcoming-dot" :class="event.status"></div>
          <div class="upcoming-info">
            <div class="upcoming-name">{{ event.clientName || 'Sin cliente' }}</div>
            <div class="upcoming-venue">{{ event.venue || 'Sin venue' }}</div>
          </div>
          <div class="upcoming-date">{{ formatEventDate(event.eventDate) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  quotations: { type: Array, default: () => [] },
})

defineEmits(['select'])

const currentDate = ref(new Date())
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const monthLabel = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDay = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const days = []

  // Previous month days
  const prevMonth = new Date(year, month, 0)
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonth.getDate() - i
    days.push({
      date: d,
      currentMonth: false,
      isToday: false,
      events: [],
      fullDate: new Date(year, month - 1, d).toISOString().split('T')[0],
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = new Date(year, month, d).toISOString().split('T')[0]
    const events = props.quotations.filter(q => q.eventDate === fullDate)
    days.push({
      date: d,
      currentMonth: true,
      isToday: fullDate === todayStr,
      events,
      fullDate,
    })
  }

  // Next month days
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({
      date: d,
      currentMonth: false,
      isToday: false,
      events: [],
      fullDate: new Date(year, month + 1, d).toISOString().split('T')[0],
    })
  }

  return days
})

const upcomingEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.quotations
    .filter(q => q.eventDate && q.eventDate >= today && q.status !== 'rechazada')
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 5)
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function formatEventDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.calendar-view {
  background: var(--white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.cal-month {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
}

.cal-nav {
  background: none;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  color: var(--gray-text);
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.cal-nav:hover {
  border-color: var(--gold);
  color: var(--black);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-weekday {
  text-align: center;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  padding: 8px 0;
  font-weight: 500;
}

.cal-day {
  min-height: 70px;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.15s;
}

.cal-day:hover {
  background: var(--gray-light);
}

.cal-day.other-month {
  opacity: 0.3;
}

.cal-day.today {
  background: rgba(201,168,106,0.1);
}

.cal-day-number {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--black);
  display: block;
  margin-bottom: 4px;
}

.cal-day.today .cal-day-number {
  color: var(--gold);
  font-weight: 700;
}

.cal-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-event {
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.cal-event.borrador { background: #f3f4f6; color: #374151; }
.cal-event.enviada { background: #dbeafe; color: #1d4ed8; }
.cal-event.aprobada { background: #dcfce7; color: #15803d; }
.cal-event.rechazada { background: #fee2e2; color: #dc2626; }

.cal-more {
  font-size: 0.6rem;
  color: var(--gray-text);
  padding: 0 4px;
}

/* Upcoming */
.upcoming-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-border);
}

.upcoming-section h4 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  margin-bottom: 12px;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.upcoming-item:hover {
  background: var(--gray-light);
}

.upcoming-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.upcoming-dot.borrador { background: #9ca3af; }
.upcoming-dot.enviada { background: #3b82f6; }
.upcoming-dot.aprobada { background: #22c55e; }

.upcoming-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--black);
}

.upcoming-venue {
  font-size: 0.72rem;
  color: var(--gray-text);
}

.upcoming-date {
  font-size: 0.75rem;
  color: var(--gray-text);
  margin-left: auto;
}

@media (max-width: 600px) {
  .calendar-grid { gap: 1px; }
  .cal-day { min-height: 50px; padding: 4px; }
  .cal-event { font-size: 0.5rem; }
}
</style>

// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Calendar Logic
  const calendarState = {
    currentDate: new Date(),
    selectedDate: null,
    selectedTime: null
  };

  const frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const frenchDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('monthLabel');
    if (!grid || !label) return;
    
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();
    
    label.textContent = `${frenchMonths[month]} ${year}`;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add day headers
    frenchDays.forEach(day => {
      grid.innerHTML += `<div class="cal-day-header">${day}</div>`;
    });
    
    // Get first day and total days
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      grid.innerHTML += `<div class="cal-day empty"></div>`;
    }
    
    // Day cells
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = calendarState.selectedDate && 
                         date.toDateString() === calendarState.selectedDate.toDateString();
      
      let classes = 'cal-day';
      if (isPast) classes += ' disabled';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      
      grid.innerHTML += `<div class="${classes}" data-day="${day}">${day}</div>`;
    }
    
    // Add click listeners
    grid.querySelectorAll('.cal-day:not(.disabled):not(.empty)').forEach(el => {
      el.addEventListener('click', () => selectDate(parseInt(el.dataset.day)));
    });
  }

  function selectDate(day) {
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();
    calendarState.selectedDate = new Date(year, month, day);
    
    renderCalendar();
    showTimeSlots();
  }

  function showTimeSlots() {
    const container = document.getElementById('timeSlotsContainer');
    const slotsDiv = document.getElementById('timeSlots');
    if (!container || !slotsDiv) return;
    
    container.style.display = 'block';
    slotsDiv.innerHTML = '';
    
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    
    times.forEach(time => {
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.textContent = time;
      slot.addEventListener('click', () => selectTimeSlot(time, slot));
      slotsDiv.appendChild(slot);
    });
    
    // Scroll to time slots
    setTimeout(() => {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  function selectTimeSlot(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    
    calendarState.selectedTime = time;
    
    // Show form
    const form = document.getElementById('_builder-form');
    const info = document.getElementById('selectedSlotInfo');
    if (!form || !info) return;
    
    const dateStr = calendarState.selectedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    info.textContent = `Rendez-vous prévu le ${dateStr} à ${time}`;
    form.style.display = 'block';
    
    // Small delay then scroll to form
    setTimeout(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  // Navigation
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() - 1);
      renderCalendar();
      const timeSlotsContainer = document.getElementById('timeSlotsContainer');
      const builderForm = document.getElementById('_builder-form');
      if (timeSlotsContainer) timeSlotsContainer.style.display = 'none';
      if (builderForm) builderForm.style.display = 'none';
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + 1);
      renderCalendar();
      const timeSlotsContainer = document.getElementById('timeSlotsContainer');
      const builderForm = document.getElementById('_builder-form');
      if (timeSlotsContainer) timeSlotsContainer.style.display = 'none';
      if (builderForm) builderForm.style.display = 'none';
    });
  }

  // Form submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
      }
      
      // Get form data
      const formData = {
        first_name: document.getElementById('prenom')?.value || '',
        last_name: document.getElementById('nom')?.value || '',
        phone: document.getElementById('telephone')?.value || '',
        email: document.getElementById('email')?.value || '',
        company: document.getElementById('entreprise')?.value || '',
        job_title: document.getElementById('poste')?.value || '',
        budget: document.getElementById('budget')?.value || '',
        message: document.getElementById('message')?.value || '',
        appointment_date: calendarState.selectedDate?.toISOString().split('T')[0] || '',
        appointment_time: calendarState.selectedTime || '',
        source: 'website'
      };
      
      try {
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          // Show success message
          const mainContent = document.querySelector('.main-content');
          const successMessage = document.getElementById('successMessage');
          const calendarSection = document.querySelector('.calendar-section');
          const builderForm = document.getElementById('_builder-form');
          const pageTitle = document.querySelector('.page-title');
          const pageSubtitle = document.querySelector('.page-subtitle');
          
          if (calendarSection) calendarSection.style.display = 'none';
          if (builderForm) builderForm.style.display = 'none';
          if (pageTitle) pageTitle.style.display = 'none';
          if (pageSubtitle) pageSubtitle.style.display = 'none';
          if (successMessage) successMessage.style.display = 'block';
        } else {
          const error = await response.json();
          alert('Erreur: ' + (error.error || 'Une erreur est survenue'));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmer le rendez-vous';
          }
        }
      } catch (error) {
        console.error('Submit error:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirmer le rendez-vous';
        }
      }
    });
  }

  // Initialize calendar
  renderCalendar();
  
  console.log("fitup contact page loaded");
});

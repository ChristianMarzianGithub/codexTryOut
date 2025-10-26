import {
  login,
  register,
  getProfile,
  getStats,
  listWorkouts,
  listMeals,
  createWorkout,
  createMeal,
  deleteWorkout,
  deleteMeal,
  updateWorkout,
  updateMeal
} from './api.js';

const app = document.getElementById('app');

const state = {
  user: null,
  stats: null,
  workouts: [],
  meals: [],
  message: null,
  messageType: 'success',
  editingWorkout: null,
  editingMeal: null
};

async function bootstrap() {
  const token = localStorage.getItem('fittrack_token');
  if (token) {
    try {
      await loadDashboard();
      return;
    } catch (error) {
      console.warn('Failed to load dashboard:', error);
      localStorage.removeItem('fittrack_token');
    }
  }
  renderAuth();
}

function renderAuth() {
  app.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'grid two-cols';

  container.appendChild(createAuthCard('Login', async formData => {
    try {
      const response = await login(formData.get('email'), formData.get('password'));
      persistSession(response);
      await loadDashboard();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }));

  container.appendChild(createAuthCard('Register', async formData => {
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName')
    };
    try {
      const response = await register(payload);
      persistSession(response);
      await loadDashboard();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }, true));

  app.appendChild(container);
}

function createAuthCard(title, onSubmit, includeName = false) {
  const card = document.createElement('div');
  card.className = 'card';

  const heading = document.createElement('h2');
  heading.textContent = title;
  card.appendChild(heading);

  const form = document.createElement('form');
  form.innerHTML = `
    ${includeName ? '<label for="fullName">Full name</label><input id="fullName" name="fullName" required />' : ''}
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" minlength="6" required />
    <button type="submit">${title}</button>
  `;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    onSubmit(formData);
  });

  card.appendChild(form);
  return card;
}

function persistSession(response) {
  if (!response?.token) return;
  localStorage.setItem('fittrack_token', response.token);
  state.user = response.user;
}

async function loadDashboard() {
  const [profile, stats, workouts, meals] = await Promise.all([
    getProfile(),
    getStats(),
    listWorkouts(),
    listMeals()
  ]);
  state.user = profile;
  state.stats = stats;
  state.workouts = workouts;
  state.meals = meals;
  state.message = null;
  renderDashboard();
}

function renderDashboard() {
  app.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'card';
  header.innerHTML = `
    <h1>Welcome back, ${state.user.fullName || state.user.email}</h1>
    <p>Track your workouts and nutrition effortlessly.</p>
    <div class="action-buttons">
      <button id="logout">Logout</button>
    </div>
  `;
  header.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem('fittrack_token');
    state.user = null;
    renderAuth();
  });
  app.appendChild(header);

  if (state.message) {
    const message = document.createElement('div');
    message.className = state.messageType;
    message.textContent = state.message;
    app.appendChild(message);
  }

  const statsCard = document.createElement('div');
  statsCard.className = 'card';
  statsCard.innerHTML = '<h2>Your stats</h2>';
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats';
  const statsMap = {
    'Workouts': state.stats?.workoutCount || 0,
    'Minutes trained': state.stats?.totalWorkoutMinutes || 0,
    'Calories burned': state.stats?.totalWorkoutCalories || 0,
    'Meals logged': state.stats?.mealCount || 0,
    'Calories eaten': state.stats?.totalMealCalories || 0,
    'Protein (g)': state.stats?.totalProtein || 0,
    'Carbs (g)': state.stats?.totalCarbs || 0,
    'Fats (g)': state.stats?.totalFats || 0
  };
  Object.entries(statsMap).forEach(([label, value]) => {
    const box = document.createElement('div');
    box.className = 'stat-box';
    box.innerHTML = `<h3>${value}</h3><p>${label}</p>`;
    statsGrid.appendChild(box);
  });
  statsCard.appendChild(statsGrid);
  app.appendChild(statsCard);

  const contentGrid = document.createElement('div');
  contentGrid.className = 'grid two-cols';
  contentGrid.appendChild(createWorkoutCard());
  contentGrid.appendChild(createMealCard());
  app.appendChild(contentGrid);
}

function createWorkoutCard() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Workouts</h2>';

  const form = document.createElement('form');
  form.innerHTML = `
    <label for="type">Type</label>
    <input id="type" name="type" placeholder="Running" required />
    <label for="durationMinutes">Duration (minutes)</label>
    <input id="durationMinutes" name="durationMinutes" type="number" min="0" required />
    <label for="caloriesBurned">Calories burned</label>
    <input id="caloriesBurned" name="caloriesBurned" type="number" min="0" required />
    <label for="date">Date</label>
    <input id="date" name="date" type="date" required />
    <button type="submit">${state.editingWorkout ? 'Update workout' : 'Add workout'}</button>
  `;

  if (state.editingWorkout) {
    const current = state.workouts.find(w => w.id === state.editingWorkout);
    if (current) {
      form.type.value = current.type;
      form.durationMinutes.value = current.durationMinutes;
      form.caloriesBurned.value = current.caloriesBurned;
      form.date.value = current.date;
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.durationMinutes = Number(payload.durationMinutes);
    payload.caloriesBurned = Number(payload.caloriesBurned);
    try {
      if (state.editingWorkout) {
        await updateWorkout(state.editingWorkout, payload);
        showMessage('Workout updated successfully', 'success');
      } else {
        await createWorkout(payload);
        showMessage('Workout added successfully', 'success');
      }
      state.editingWorkout = null;
      form.reset();
      await refreshWorkouts();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  card.appendChild(form);

  const list = document.createElement('div');
  state.workouts.forEach(workout => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <span>${workout.type} • ${workout.durationMinutes} min</span><br />
        <small>${workout.date} • ${workout.caloriesBurned} kcal</small>
      </div>
      <div class="inline-actions">
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    `;
    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
      state.editingWorkout = workout.id;
      renderDashboard();
    });
    item.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      try {
        await deleteWorkout(workout.id);
        showMessage('Workout deleted', 'success');
        await refreshWorkouts();
      } catch (error) {
        showMessage(error.message, 'error');
      }
    });
    list.appendChild(item);
  });
  card.appendChild(list);
  return card;
}

function createMealCard() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = '<h2>Meals</h2>';

  const form = document.createElement('form');
  form.innerHTML = `
    <label for="name">Name</label>
    <input id="name" name="name" placeholder="Breakfast" required />
    <label for="calories">Calories</label>
    <input id="calories" name="calories" type="number" min="0" required />
    <label for="protein">Protein (g)</label>
    <input id="protein" name="protein" type="number" min="0" value="0" />
    <label for="carbs">Carbs (g)</label>
    <input id="carbs" name="carbs" type="number" min="0" value="0" />
    <label for="fats">Fats (g)</label>
    <input id="fats" name="fats" type="number" min="0" value="0" />
    <label for="date">Date</label>
    <input id="date" name="date" type="date" required />
    <button type="submit">${state.editingMeal ? 'Update meal' : 'Add meal'}</button>
  `;

  if (state.editingMeal) {
    const current = state.meals.find(m => m.id === state.editingMeal);
    if (current) {
      form.name.value = current.name;
      form.calories.value = current.calories;
      form.protein.value = current.protein;
      form.carbs.value = current.carbs;
      form.fats.value = current.fats;
      form.date.value = current.date;
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.calories = Number(payload.calories);
    payload.protein = Number(payload.protein || 0);
    payload.carbs = Number(payload.carbs || 0);
    payload.fats = Number(payload.fats || 0);
    try {
      if (state.editingMeal) {
        await updateMeal(state.editingMeal, payload);
        showMessage('Meal updated successfully', 'success');
      } else {
        await createMeal(payload);
        showMessage('Meal added successfully', 'success');
      }
      state.editingMeal = null;
      form.reset();
      await refreshMeals();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  card.appendChild(form);

  const list = document.createElement('div');
  state.meals.forEach(meal => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <span>${meal.name} • ${meal.calories} kcal</span><br />
        <small>${meal.date} • P:${meal.protein}g C:${meal.carbs}g F:${meal.fats}g</small>
      </div>
      <div class="inline-actions">
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    `;
    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
      state.editingMeal = meal.id;
      renderDashboard();
    });
    item.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      try {
        await deleteMeal(meal.id);
        showMessage('Meal deleted', 'success');
        await refreshMeals();
      } catch (error) {
        showMessage(error.message, 'error');
      }
    });
    list.appendChild(item);
  });
  card.appendChild(list);
  return card;
}

function showMessage(text, type) {
  state.message = text;
  state.messageType = type;
  renderDashboard();
}

async function refreshWorkouts() {
  const [workouts, stats] = await Promise.all([listWorkouts(), getStats()]);
  state.workouts = workouts;
  state.stats = stats;
  renderDashboard();
}

async function refreshMeals() {
  const [meals, stats] = await Promise.all([listMeals(), getStats()]);
  state.meals = meals;
  state.stats = stats;
  renderDashboard();
}

bootstrap();

import { useEffect, useMemo, useState } from 'react';
import {
  createMeal,
  createWorkout,
  deleteMeal,
  deleteWorkout,
  fetchMeals,
  fetchStats,
  fetchWorkouts,
  updateMeal,
  updateWorkout
} from '../api/client.js';
import { format } from '../utils/date.js';

const defaultWorkoutForm = {
  id: null,
  type: '',
  durationMinutes: 30,
  caloriesBurned: 250,
  date: format(new Date())
};

const defaultMealForm = {
  id: null,
  name: '',
  calories: 500,
  protein: 30,
  carbs: 60,
  fats: 20,
  date: format(new Date())
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [workoutForm, setWorkoutForm] = useState(defaultWorkoutForm);
  const [mealForm, setMealForm] = useState(defaultMealForm);
  const [loading, setLoading] = useState(true);
  const [submittingWorkout, setSubmittingWorkout] = useState(false);
  const [submittingMeal, setSubmittingMeal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, workoutsData, mealsData] = await Promise.all([
          fetchStats(),
          fetchWorkouts(),
          fetchMeals()
        ]);
        setStats(statsData);
        setWorkouts(workoutsData);
        setMeals(mealsData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totals = useMemo(
    () => ({
      workoutMinutes: stats?.totalWorkoutMinutes ?? 0,
      workoutCalories: stats?.totalWorkoutCalories ?? 0,
      mealCalories: stats?.totalMealCalories ?? 0,
      protein: stats?.totalProtein ?? 0,
      carbs: stats?.totalCarbs ?? 0,
      fats: stats?.totalFats ?? 0
    }),
    [stats]
  );

  const handleWorkoutChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ['durationMinutes', 'caloriesBurned'];
    setWorkoutForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleMealChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ['calories', 'protein', 'carbs', 'fats'];
    setMealForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const resetWorkoutForm = () => setWorkoutForm({ ...defaultWorkoutForm, date: format(new Date()) });
  const resetMealForm = () => setMealForm({ ...defaultMealForm, date: format(new Date()) });

  const handleWorkoutSubmit = async (event) => {
    event.preventDefault();
    setSubmittingWorkout(true);
    try {
      const payload = {
        type: workoutForm.type,
        durationMinutes: Number(workoutForm.durationMinutes),
        caloriesBurned: Number(workoutForm.caloriesBurned),
        date: workoutForm.date
      };
      if (workoutForm.id) {
        const updated = await updateWorkout(workoutForm.id, payload);
        setWorkouts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createWorkout(payload);
        setWorkouts((prev) => [...prev, created]);
      }
      const newStats = await fetchStats();
      setStats(newStats);
      resetWorkoutForm();
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save workout');
    } finally {
      setSubmittingWorkout(false);
    }
  };

  const handleMealSubmit = async (event) => {
    event.preventDefault();
    setSubmittingMeal(true);
    try {
      const payload = {
        name: mealForm.name,
        calories: Number(mealForm.calories),
        protein: Number(mealForm.protein),
        carbs: Number(mealForm.carbs),
        fats: Number(mealForm.fats),
        date: mealForm.date
      };
      if (mealForm.id) {
        const updated = await updateMeal(mealForm.id, payload);
        setMeals((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createMeal(payload);
        setMeals((prev) => [...prev, created]);
      }
      const newStats = await fetchStats();
      setStats(newStats);
      resetMealForm();
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save meal');
    } finally {
      setSubmittingMeal(false);
    }
  };

  const startEditingWorkout = (workout) => {
    setWorkoutForm({
      id: workout.id,
      type: workout.type,
      durationMinutes: workout.durationMinutes,
      caloriesBurned: workout.caloriesBurned,
      date: workout.date
    });
  };

  const startEditingMeal = (meal) => {
    setMealForm({
      id: meal.id,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      date: meal.date
    });
  };

  const handleWorkoutDelete = async (id) => {
    if (!confirm('Delete this workout?')) return;
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((item) => item.id !== id));
      const newStats = await fetchStats();
      setStats(newStats);
    } catch (err) {
      setError(err.message || 'Failed to delete workout');
    }
  };

  const handleMealDelete = async (id) => {
    if (!confirm('Delete this meal?')) return;
    try {
      await deleteMeal(id);
      setMeals((prev) => prev.filter((item) => item.id !== id));
      const newStats = await fetchStats();
      setStats(newStats);
    } catch (err) {
      setError(err.message || 'Failed to delete meal');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg font-semibold text-slate-600">Loading your data…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Workout Minutes" value={totals.workoutMinutes} suffix="min" />
          <StatCard title="Workout Calories" value={totals.workoutCalories} suffix="kcal" />
          <StatCard title="Consumed Calories" value={totals.mealCalories} suffix="kcal" />
          <StatCard title="Protein" value={totals.protein} suffix="g" />
          <StatCard title="Carbs" value={totals.carbs} suffix="g" />
          <StatCard title="Fats" value={totals.fats} suffix="g" />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">Workouts</h2>
            <p className="text-sm text-slate-500">
              Log your training sessions to monitor performance over time.
            </p>
          </header>
          <form onSubmit={handleWorkoutSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="type">
                  Workout type
                </label>
                <input
                  id="type"
                  name="type"
                  required
                  placeholder="Running"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={workoutForm.type}
                  onChange={handleWorkoutChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="durationMinutes">
                  Duration (minutes)
                </label>
                <input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={workoutForm.durationMinutes}
                  onChange={handleWorkoutChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="caloriesBurned">
                  Calories burned
                </label>
                <input
                  id="caloriesBurned"
                  name="caloriesBurned"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={workoutForm.caloriesBurned}
                  onChange={handleWorkoutChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="workout-date">
                  Date
                </label>
                <input
                  id="workout-date"
                  name="date"
                  type="date"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={workoutForm.date}
                  onChange={handleWorkoutChange}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submittingWorkout}
                className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {workoutForm.id ? 'Update workout' : 'Add workout'}
              </button>
              {workoutForm.id && (
                <button
                  type="button"
                  onClick={resetWorkoutForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <ul className="space-y-3">
            {workouts.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                No workouts logged yet. Start by adding your first session.
              </li>
            )}
            {workouts.map((workout) => (
              <li key={workout.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{workout.type}</h3>
                    <p className="text-sm text-slate-500">
                      {format(new Date(workout.date))} • {workout.durationMinutes} min • {workout.caloriesBurned} kcal
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingWorkout(workout)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleWorkoutDelete(workout.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">Meals</h2>
            <p className="text-sm text-slate-500">
              Capture your nutrition to balance macros and calories.
            </p>
          </header>
          <form onSubmit={handleMealSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="meal-name">
                  Meal name
                </label>
                <input
                  id="meal-name"
                  name="name"
                  required
                  placeholder="Lunch"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.name}
                  onChange={handleMealChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="calories">
                  Calories
                </label>
                <input
                  id="calories"
                  name="calories"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.calories}
                  onChange={handleMealChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="protein">
                  Protein (g)
                </label>
                <input
                  id="protein"
                  name="protein"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.protein}
                  onChange={handleMealChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="carbs">
                  Carbs (g)
                </label>
                <input
                  id="carbs"
                  name="carbs"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.carbs}
                  onChange={handleMealChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="fats">
                  Fats (g)
                </label>
                <input
                  id="fats"
                  name="fats"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.fats}
                  onChange={handleMealChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="meal-date">
                  Date
                </label>
                <input
                  id="meal-date"
                  name="date"
                  type="date"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={mealForm.date}
                  onChange={handleMealChange}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submittingMeal}
                className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {mealForm.id ? 'Update meal' : 'Add meal'}
              </button>
              {mealForm.id && (
                <button
                  type="button"
                  onClick={resetMealForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <ul className="space-y-3">
            {meals.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                No meals tracked yet. Log a meal to see nutrition insights.
              </li>
            )}
            {meals.map((meal) => (
              <li key={meal.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{meal.name}</h3>
                    <p className="text-sm text-slate-500">
                      {format(new Date(meal.date))} • {meal.calories} kcal • P{meal.protein} / C{meal.carbs} / F{meal.fats}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingMeal(meal)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleMealDelete(meal.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, suffix }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
        {suffix && <span className="ml-1 text-base font-medium text-slate-500">{suffix}</span>}
      </p>
    </div>
  );
}

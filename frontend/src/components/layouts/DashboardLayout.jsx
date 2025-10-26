import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">FitTrack Dashboard</h1>
            {user && (
              <p className="text-sm text-slate-500">Welcome back, {user.fullName || user.email}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">{children}</main>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';

export default function AuthLayout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">FitTrack</h1>
          <p className="text-slate-600">Track your workouts and nutrition in one place.</p>
        </div>
        {children}
        <p className="text-center text-sm text-slate-500">
          {isLogin ? (
            <span>
              Don&apos;t have an account? <Link to="/register">Create one</Link>
            </span>
          ) : (
            <span>
              Already registered? <Link to="/login">Sign in</Link>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

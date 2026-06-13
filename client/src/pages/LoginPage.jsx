import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Activity } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] border-r border-[var(--color-border)] p-12">
        <div className="flex items-center gap-2 text-[var(--color-text)]">
          <Activity size={18} strokeWidth={2} />
          <span className="text-sm font-semibold tracking-tight">Fitness</span>
        </div>
        <div>
          <p className="text-3xl font-semibold text-[var(--color-text)] leading-snug tracking-tight mb-3">
            Track what matters.<br />Improve what you measure.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
            Log workouts, monitor calories burned, and build consistent habits — all in one place.
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-faint)]">© 2025 Fitness Tracker</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 text-[var(--color-text)] mb-8 lg:hidden">
            <Activity size={18} strokeWidth={2} />
            <span className="text-sm font-semibold tracking-tight">Fitness</span>
          </div>

          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-1 tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="text-xs text-[var(--color-error)] bg-[#ef444410] border border-[#ef444430] rounded-[var(--radius-md)] px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-[var(--color-text-muted)] mt-6 text-center">
            No account?{' '}
            <Link
              to="/register"
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Activity } from 'lucide-react';

const RegisterPage = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      // Auto-login after registration
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError('Registration failed. Please try again.');
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
            Start tracking<br />from day one.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
            Create your account and begin logging workouts in seconds. No setup required.
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
            Create account
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Fill in the details below to get started
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="register-firstname"
                label="First Name"
                type="text"
                placeholder="Jane"
                value={form.firstName}
                onChange={set('firstName')}
                autoComplete="given-name"
              />
              <Input
                id="register-lastname"
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={set('lastName')}
                autoComplete="family-name"
              />
            </div>
            <Input
              id="register-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="text-xs text-[var(--color-error)] bg-[#ef444410] border border-[#ef444430] rounded-[var(--radius-md)] px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Create account
            </Button>
          </form>

          <p className="text-sm text-[var(--color-text-muted)] mt-6 text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

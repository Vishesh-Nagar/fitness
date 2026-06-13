import { Link, useNavigate } from 'react-router';
import { LogOut, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-150"
        >
          <Activity size={18} strokeWidth={2} />
          <span className="text-sm font-semibold tracking-tight">Fitness</span>
        </Link>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-xs text-[var(--color-text-muted)] hidden sm:block">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-150 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={2} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

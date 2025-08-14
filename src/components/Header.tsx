import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/solid';
import { useAuth } from '../auth/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="bg-[#1E3A5F] text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-lg font-medium">Welcome{user ? `, ${user.displayName?.split(' ')[0] || 'User'}` : ', User'}!</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          title="Home"
          className="bg-vdx-blue p-2 rounded-full hover:brightness-95 transition"
        >
          <HomeIcon className="w-6 h-6 text-white" />
        </button>
        {!user ? (
          <button onClick={signIn} className="bg-vdx-blue px-3 py-2 rounded-2xl hover:brightness-95">
            Sign in
          </button>
        ) : (
          <button onClick={signOut} className="bg-vdx-blue px-3 py-2 rounded-2xl hover:brightness-95">
            Sign out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

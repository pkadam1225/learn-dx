
import { NavLink } from 'react-router-dom';
import { HomeIcon, ClipboardIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';

const item =
  'flex items-center gap-2 px-4 py-3 rounded-xl transition hover:bg-white/5';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#1E3A5F] text-white h-screen flex flex-col justify-between shadow-lg">
      <div className="p-6 space-y-10">
        <div className="text-2xl font-semibold tracking-wide">LearnDx</div>
        <nav className="flex flex-col space-y-2 text-sm">
          <NavLink to="/" className={({isActive}) => `${item} ${isActive ? 'bg-white/10' : ''}`}>
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/create" className={({isActive}) => `${item} ${isActive ? 'bg-white/10' : ''}`}>
            <ClipboardIcon className="w-5 h-5" />
            Create Test
          </NavLink>
          <NavLink to="/help" className={({isActive}) => `${item} ${isActive ? 'bg-white/10' : ''}`}>
            <QuestionMarkCircleIcon className="w-5 h-5" />
            Help
          </NavLink>
        </nav>
      </div>
      <div className="text-xs text-center mb-6 text-gray-300">
        <a
          href="https://www.visualdx.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-blue-400"
        >
          Powered by VisualDx
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;


import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../nav.scss'

const Nav = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  return (
    <div className='nav-bar'>
      <div className='brand'>
        <Link to="/">Insta Clone</Link>
      </div>
      <div className='nav-actions'>
        <Link className='nav-link' to="/create-post">New Post</Link>
        <Link className='nav-link' to="/profile">Profile</Link>
        {user ? (
          <button
            onClick={() => {
              handleLogout();
              navigate('/login');
            }}
            className='button primary-button'
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='button primary-button'
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Nav
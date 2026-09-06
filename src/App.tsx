import { useState } from 'react';
import { RoleContext } from './context/RoleContext';
import type { Role } from './context/RoleContext';
import Login from './screens/Login';

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<'login' | 'register' | 'dashboard'>('login');

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setScreen('dashboard');
  };

  const handleRegister = () => {
    setScreen('register');
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {screen === 'login' && (
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      )}
      {screen === 'dashboard' && (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #0D1F33 0%, #16324F 55%, #1a3d60 100%)',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
            Welcome, {role}!
          </h1>
          <button
            onClick={() => setScreen('login')}
            style={{
              background: '#C9A24B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Back to Login
          </button>
        </div>
      )}
      {screen === 'register' && (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #0D1F33 0%, #16324F 55%, #1a3d60 100%)',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Register Page</h1>
          <button
            onClick={() => setScreen('login')}
            style={{
              background: '#C9A24B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Back to Login
          </button>
        </div>
      )}
    </RoleContext.Provider>
  );
}

export default App;

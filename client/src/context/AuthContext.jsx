import { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, registerRequest } from '../api/auth.service';
import toast from 'react-hot-toast';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Configurar el token en los headers de axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Aquí podrías verificar el token con el backend si tienes un endpoint
        // const res = await verifyTokenRequest();
        // setUser(res.user);
        
        // Por ahora, solo guardamos el token
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const signin = async (credentials) => {
    try {
      const res = await loginRequest(credentials);
      
      if (res.token) {
        localStorage.setItem('token', res.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
        setUser(res.user || credentials);
        setIsAuthenticated(true);
        
        const userName = res.user?.name || res.user?.email || 'Usuario';
        toast.success(`¡Bienvenido ${userName}!`, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        return res;
      }
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      
      // El backend devuelve el token directamente en /register (auto-login)
      if (res.token) {
        localStorage.setItem('token', res.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
        setUser(res.user || userData);
        setIsAuthenticated(true);
        
        const userName = res.user?.name || res.user?.email || 'Usuario';
        toast.success(`¡Cuenta creada! Bienvenido ${userName}`, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        return res;
      }
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success('Sesión cerrada correctamente', {
      duration: 2000,
      position: 'top-center',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

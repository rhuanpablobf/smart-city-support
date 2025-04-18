
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MainNavProps {
  className?: string;
}

export const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const { authState } = useAuth();
  const isLoggedIn = authState.isAuthenticated;
  
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        Início
      </NavLink>
      
      {isLoggedIn ? (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          Dashboard
        </NavLink>
      ) : (
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          Atendimento
        </NavLink>
      )}
      
      <NavLink
        to="/login"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {isLoggedIn ? "Minha Conta" : "Entrar"}
      </NavLink>
    </nav>
  );
};

export default MainNav;

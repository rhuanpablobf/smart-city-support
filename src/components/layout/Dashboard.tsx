
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, Settings, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    path: '/dashboard',
    label: 'Atendimento',
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ['admin', 'secretary_admin', 'manager', 'agent'],
  },
  {
    path: '/reports',
    label: 'Relatórios',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['admin', 'secretary_admin', 'manager'],
  },
  {
    path: '/users',
    label: 'Usuários',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'secretary_admin', 'manager'],
  },
  {
    path: '/units',
    label: 'Unidades e Serviços',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['admin', 'secretary_admin'],
  },
  {
    path: '/settings',
    label: 'Configurações',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'],
  },
];

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li>
      <NavLink to={to} className="block">
        <div
          className={cn(
            'flex items-center px-4 py-3 text-sm font-medium rounded-md',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-700 hover:text-primary hover:bg-gray-100'
          )}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: cn('mr-3 h-5 w-5', (icon as React.ReactElement).props.className),
          })}
          {children}
        </div>
      </NavLink>
    </li>
  );
};

const DashboardLayout = () => {
  const { authState, logout } = useAuth();
  const user = authState.user;
  const userRole = user?.role || 'user';
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold">ChatPrefeitura</h1>
        </div>
        
        {/* User info */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
        </div>
        
        {/* Nav items */}
        <nav className="p-2 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavItem key={item.path} to={item.path} icon={item.icon}>
                {item.label}
              </NavItem>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-700"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

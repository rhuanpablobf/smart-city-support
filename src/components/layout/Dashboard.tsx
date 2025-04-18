
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, Settings, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

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

const NavItem = ({ to, isActive, icon, children }: {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <NavLink to={to} className="w-full">
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-gray-700 hover:bg-gray-100"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: cn('h-5 w-5', (icon as React.ReactElement).props.className),
          })}
          <span>{children}</span>
        </div>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const DashboardLayout = () => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const user = authState.user;
  const userRole = user?.role || 'user';
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <h1 className="text-xl font-bold">ChatPrefeitura</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                isActive={location.pathname === item.path}
              >
                {item.label}
              </NavItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={logout}
          >
            Sair
          </Button>
        </SidebarFooter>
      </Sidebar>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

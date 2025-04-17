
import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { authState, logout, updateUserStatus } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!authState.user) {
    // Redirect to login if not authenticated
    navigate('/login');
    return null;
  }

  const isAdmin = authState.user.role === 'admin';
  const isManager = authState.user.role === 'manager';
  const isAgent = authState.user.role === 'agent';

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Você foi desconectado');
  };

  const handleStatusChange = (status: 'online' | 'offline' | 'break') => {
    updateUserStatus(status);
    
    const statusText = {
      'online': 'Online',
      'offline': 'Offline',
      'break': 'Em pausa'
    };
    
    toast.success(`Status atualizado para: ${statusText[status]}`);
  };

  const navigation = [
    {
      name: 'Atendimento',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/dashboard',
      allowed: true
    },
    {
      name: 'Usuários',
      icon: <Users className="h-5 w-5" />,
      href: '/users',
      allowed: isAdmin || isManager
    },
    {
      name: 'Unidades e Serviços',
      icon: <Building2 className="h-5 w-5" />,
      href: '/units',
      allowed: isAdmin
    },
    {
      name: 'Relatórios',
      icon: <BarChart className="h-5 w-5" />,
      href: '/reports',
      allowed: isAdmin || isManager
    },
    {
      name: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
      allowed: isAdmin
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:transform-none lg:relative ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-primary">Smart City Support</h1>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User status section */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authState.user.avatar || ''} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{authState.user.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="capitalize">{authState.user.role}</span>
                </div>
              </div>
            </div>

            {isAgent && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-500">Status:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={authState.user.status === 'online' ? 'default' : 'outline'}
                    size="sm"
                    className={`${authState.user.status === 'online' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => handleStatusChange('online')}
                  >
                    Online
                  </Button>
                  <Button
                    variant={authState.user.status === 'break' ? 'default' : 'outline'}
                    size="sm"
                    className={`${authState.user.status === 'break' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                    onClick={() => handleStatusChange('break')}
                  >
                    Pausa
                  </Button>
                  <Button
                    variant={authState.user.status === 'offline' ? 'default' : 'outline'}
                    size="sm"
                    className={`${authState.user.status === 'offline' ? 'bg-gray-500 hover:bg-gray-600' : ''}`}
                    onClick={() => handleStatusChange('offline')}
                  >
                    Offline
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation
              .filter(item => item.allowed)
              .map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    window.location.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 border-b">
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-medium ml-4 lg:ml-0">
            {navigation.find(item => item.href === window.location.pathname)?.name || 'Painel'}
          </h1>
          
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex">v1.0.0</Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <span className="sr-only">Abrir menu</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={authState.user.avatar || ''} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 ml-1" />
                  
                  {authState.user.status && (
                    <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
                      authState.user.status === 'online' ? 'bg-green-500' :
                      authState.user.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

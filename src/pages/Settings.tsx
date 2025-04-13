
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  // General settings
  const [companyName, setCompanyName] = useState('Prefeitura Municipal');
  const [logoUrl, setLogoUrl] = useState('/placeholder.svg');
  const [primaryColor, setPrimaryColor] = useState('#2196F3');
  const [enableDarkMode, setEnableDarkMode] = useState(true);

  // Chat settings
  const [welcomeMessage, setWelcomeMessage] = useState('Olá! Como posso ajudar?');
  const [inactivityTimeout, setInactivityTimeout] = useState(60);
  const [maxInactivityWarnings, setMaxInactivityWarnings] = useState(2);
  const [showQueuePosition, setShowQueuePosition] = useState(true);
  const [enableFileSharing, setEnableFileSharing] = useState(true);
  const [allowedFileTypes, setAllowedFileTypes] = useState('pdf,jpg,png,doc,docx');
  const [maxFileSize, setMaxFileSize] = useState(5);

  // Bot settings
  const [enableBot, setEnableBot] = useState(true);
  const [askCpfFirst, setAskCpfFirst] = useState(true);
  const [botResponseSpeed, setBotResponseSpeed] = useState([70]);
  const [collectSurvey, setCollectSurvey] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  const handleSaveGeneral = () => {
    toast.success('Configurações gerais salvas com sucesso');
  };

  const handleSaveChat = () => {
    toast.success('Configurações de chat salvas com sucesso');
  };

  const handleSaveBot = () => {
    toast.success('Configurações do bot salvas com sucesso');
  };

  const handleSaveNotifications = () => {
    toast.success('Configurações de notificações salvas com sucesso');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Configurações do Sistema</h1>
        <p className="text-gray-500">
          Personalize e configure o comportamento do sistema
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="bot">Bot</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Personalize a aparência e comportamento geral do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Instituição</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">URL do Logo</Label>
                  <Input
                    id="logo"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Habilitar Modo Escuro</Label>
                    <Switch
                      checked={enableDarkMode}
                      onCheckedChange={setEnableDarkMode}
                      id="dark-mode"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Chat</CardTitle>
              <CardDescription>
                Configure o comportamento das conversas e interações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Mensagem de Boas-Vindas</Label>
                <Input
                  id="welcome-message"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inactivity-timeout">
                    Tempo de Inatividade (segundos)
                  </Label>
                  <Input
                    id="inactivity-timeout"
                    type="number"
                    min={30}
                    max={300}
                    value={inactivityTimeout}
                    onChange={(e) => setInactivityTimeout(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-warnings">
                    Máximo de Avisos de Inatividade
                  </Label>
                  <Input
                    id="max-warnings"
                    type="number"
                    min={1}
                    max={5}
                    value={maxInactivityWarnings}
                    onChange={(e) => setMaxInactivityWarnings(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-queue">Mostrar Posição na Fila</Label>
                  <Switch
                    checked={showQueuePosition}
                    onCheckedChange={setShowQueuePosition}
                    id="show-queue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="file-sharing">Permitir Compartilhamento de Arquivos</Label>
                  <Switch
                    checked={enableFileSharing}
                    onCheckedChange={setEnableFileSharing}
                    id="file-sharing"
                  />
                </div>
              </div>

              {enableFileSharing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="file-types">Tipos de Arquivos Permitidos</Label>
                    <Input
                      id="file-types"
                      value={allowedFileTypes}
                      onChange={(e) => setAllowedFileTypes(e.target.value)}
                      placeholder="Separados por vírgula (pdf,jpg,png)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file-size">
                      Tamanho Máximo de Arquivos (MB)
                    </Label>
                    <Input
                      id="file-size"
                      type="number"
                      min={1}
                      max={20}
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleSaveChat}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Bot</CardTitle>
              <CardDescription>
                Configure o comportamento do assistente virtual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-bot">Habilitar Bot</Label>
                <Switch
                  checked={enableBot}
                  onCheckedChange={setEnableBot}
                  id="enable-bot"
                />
              </div>

              {enableBot && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ask-cpf">Solicitar CPF no início</Label>
                    <Switch
                      checked={askCpfFirst}
                      onCheckedChange={setAskCpfFirst}
                      id="ask-cpf"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="response-speed" className="mb-2 block">
                        Velocidade de Resposta do Bot ({botResponseSpeed}%)
                      </Label>
                      <Slider
                        id="response-speed"
                        defaultValue={botResponseSpeed}
                        max={100}
                        step={10}
                        onValueChange={setBotResponseSpeed}
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Mais Rápido</span>
                        <span>Mais Natural</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="collect-survey">
                      Coletar Pesquisa de Satisfação
                    </Label>
                    <Switch
                      checked={collectSurvey}
                      onCheckedChange={setCollectSurvey}
                      id="collect-survey"
                    />
                  </div>
                </>
              )}

              <Button onClick={handleSaveBot}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando você será notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  id="email-notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sound-alerts">Alertas Sonoros</Label>
                <Switch
                  checked={soundAlerts}
                  onCheckedChange={setSoundAlerts}
                  id="sound-alerts"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="desktop-notifications">
                  Notificações de Desktop
                </Label>
                <Switch
                  checked={desktopNotifications}
                  onCheckedChange={setDesktopNotifications}
                  id="desktop-notifications"
                />
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;


import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  onSendFile,
  disabled = false,
  placeholder = 'Digite sua mensagem...'
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }
      
      if (selectedFile && onSendFile) {
        onSendFile(selectedFile);
        setSelectedFile(null);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t p-2 bg-white">
      {selectedFile && (
        <div className="flex items-center mb-2 p-1 bg-gray-100 rounded">
          <Paperclip className="h-4 w-4 text-gray-500 mx-1" />
          <span className="text-sm truncate flex-1">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={removeSelectedFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end space-x-2">
        {onSendFile && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={triggerFileInput}
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
          </>
        )}

        {/* Emoji button (placeholder for future implementation) */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          disabled={true}
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>

        <div className="flex-1 relative">
          <textarea
            className="resize-none w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px]"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            disabled={disabled}
            style={{ height: 'auto', maxHeight: '120px' }}
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !selectedFile)}
          className="rounded-full aspect-square"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;


import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoteEncryption } from '@/utils/encryption';
import { toast } from 'sonner';

interface EncryptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'encrypt' | 'decrypt';
  content: string;
  passwordHash?: string;
  salt?: string;
  onSuccess: (result: { 
    content: string; 
    isEncrypted: boolean; 
    encryptedContent?: string;
    passwordHash?: string;
    salt?: string;
  }) => void;
}

const EncryptionDialog: React.FC<EncryptionDialogProps> = ({
  isOpen,
  onClose,
  mode,
  content,
  passwordHash,
  salt,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'encrypt') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }

        const { encryptedContent, passwordHash: newPasswordHash, salt: newSalt } = await NoteEncryption.encrypt(content, password);
        onSuccess({
          content: '',
          isEncrypted: true,
          encryptedContent,
          passwordHash: newPasswordHash,
          salt: newSalt
        });
        toast.success('Note encrypted successfully');
      } else {
        if (!passwordHash || !salt) {
          toast.error('Missing encryption data');
          setIsLoading(false);
          return;
        }

        // Verify password first
        const isValidPassword = await NoteEncryption.verifyPassword(password, passwordHash, salt);
        if (!isValidPassword) {
          toast.error('Incorrect password');
          setIsLoading(false);
          return;
        }

        const decryptedContent = await NoteEncryption.decrypt(content, password, salt);
        onSuccess({
          content: decryptedContent,
          isEncrypted: false,
          encryptedContent: undefined,
          passwordHash: undefined,
          salt: undefined
        });
        toast.success('Note decrypted successfully');
      }

      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      console.error('Encryption/Decryption error:', error);
      toast.error(mode === 'encrypt' ? 'Failed to encrypt note' : 'Failed to decrypt note - check your password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'encrypt' ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            {mode === 'encrypt' ? 'Encrypt Note' : 'Decrypt Note'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'encrypt' 
              ? 'Enter a password to encrypt this note. Make sure to remember it!'
              : 'Enter the password to decrypt this note.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={mode === 'encrypt' ? 8 : 1}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {mode === 'encrypt' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                minLength={8}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !password}>
              {isLoading ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt' : 'Decrypt')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EncryptionDialog;

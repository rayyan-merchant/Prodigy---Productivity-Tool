
// Enhanced encryption utility with password verification
export class NoteEncryption {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // Generate a key from password
  private static async generateKey(password: string, salt: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Create password verification hash
  private static async createPasswordHash(password: string, salt: string): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  }

  // Encrypt note content with password verification
  static async encrypt(content: string, password: string): Promise<{ encryptedContent: string; passwordHash: string; salt: string }> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const saltString = btoa(String.fromCharCode(...salt));
      
      const key = await this.generateKey(password, saltString);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedContent = this.encoder.encode(content);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedContent
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      const encryptedContent = btoa(String.fromCharCode(...combined));
      const passwordHash = await this.createPasswordHash(password, saltString);

      return {
        encryptedContent,
        passwordHash,
        salt: saltString
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt note');
    }
  }

  // Decrypt note content
  static async decrypt(encryptedContent: string, password: string, salt: string): Promise<string> {
    try {
      const key = await this.generateKey(password, salt);
      
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedContent).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt note - incorrect password?');
    }
  }

  // Verify password against stored hash
  static async verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
    try {
      const computedHash = await this.createPasswordHash(password, salt);
      return computedHash === storedHash;
    } catch {
      return false;
    }
  }
}

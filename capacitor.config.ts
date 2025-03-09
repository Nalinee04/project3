import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-test',
  webDir: 'public',
  server: {
    url: ' https://3e69-2001-fb1-18b-9c71-51cf-86df-791d-8bad.ngrok-free.app',
    cleartext: true
  }
};
export default config;

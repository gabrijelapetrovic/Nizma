import { createHash } from 'node:crypto';

const pin = process.argv[2];
if (!pin) {
  console.error('Upotreba: npm run pin-hash -- VAS-PIN');
  process.exit(1);
}

const hash = createHash('sha256').update(pin, 'utf8').digest('hex');
console.log(hash);
console.log('\nNa Vercel (Production) stavi ISTI hash u obe varijable:');
console.log('  VITE_ADMIN_PIN_HASH');
console.log('  ADMIN_PIN_HASH');
console.log('PIN nikad ne ide na Vercel. Posle VITE_ izmene uradi Redeploy.');

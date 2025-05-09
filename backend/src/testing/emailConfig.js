// Create a test file to verify environment variables
import { config } from "dotenv";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

console.log('Environment Variables Test:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[PRESENT]' : '[MISSING]');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('Directory:', __dirname);
console.log('.env path:', join(process.cwd(), '.env'));
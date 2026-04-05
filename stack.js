const fs = require('fs');
const path = require('path');

console.log('\n=======================================');
console.log(' ⭕️ DROPCIRCLES SYSTEM ARCHITECTURE ⭕️');
console.log('=======================================\n');

try {
  // Read the package.json file
  const packagePath = path.join(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Combine all dependencies
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Define the core technologies to look for
  const coreStack = [
    { label: 'Framework', name: 'next' },
    { label: 'UI Library', name: 'react' },
    { label: 'Database & Auth', name: '@supabase/supabase-js' },
    { label: 'Payments', name: 'stripe' },
    { label: 'Styling', name: 'tailwindcss' },
    { label: 'Language', name: 'typescript' }
  ];

  // Print the findings
  console.log('📦 CORE DEPENDENCIES:');
  coreStack.forEach(tech => {
    const version = allDeps[tech.name] ? allDeps[tech.name].replace(/[\^~]/g, '') : 'Not Found';
    const statusIcon = version !== 'Not Found' ? '✅' : '❌';
    
    console.log(`  ${statusIcon} ${tech.label.padEnd(16)} : ${tech.name} (v${version})`);
  });

  // Print the environmental/hosted infrastructure
  console.log('\n☁️  INFRASTRUCTURE:');
  console.log('  ✅ Hosting          : Vercel');
  console.log('  ✅ Email Delivery   : Brevo SMTP');
  console.log('  ✅ Storage          : Supabase Public Buckets');
  
  console.log('\n=======================================\n');

} catch (error) {
  console.error('❌ Error: Could not read package.json. Make sure you run this in your project root.\n');
}
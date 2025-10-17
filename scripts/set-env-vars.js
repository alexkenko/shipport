const https = require('https');

const projectId = 'prj_qVbTGOXeFt9RNLqfgLBiqqZ6Jsop';
const teamId = 'team_nMPyhCL95UjQVKpLlQiImFsr';

// Get Vercel token from command line or environment
const token = process.argv[2] || process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ Error: Vercel token required.');
  console.log('Usage: node set-env-vars.js <VERCEL_TOKEN>');
  console.log('Or set VERCEL_TOKEN environment variable');
  process.exit(1);
}

const envVars = [
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    value: 'https://shipinport.com',
    target: ['production', 'preview', 'development'],
    type: 'plain'
  },
  {
    key: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
    value: 'G-N64DM3EHCR',
    target: ['production', 'preview', 'development'],
    type: 'plain'
  }
];

async function createEnvVar(envVar) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key: envVar.key,
      value: envVar.value,
      target: envVar.target,
      type: envVar.type
    });

    const options = {
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Set ${envVar.key}`);
          resolve(JSON.parse(body));
        } else {
          console.error(`❌ Failed to set ${envVar.key}: ${res.statusCode}`);
          console.error(body);
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error setting ${envVar.key}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function setAllEnvVars() {
  console.log('🚀 Setting environment variables for shipinport.com...\n');
  
  for (const envVar of envVars) {
    try {
      await createEnvVar(envVar);
    } catch (error) {
      console.error(`Failed to set ${envVar.key}`);
    }
  }
  
  console.log('\n✨ Done! Redeploy your project for changes to take effect.');
  console.log('Run: vercel --prod');
}

setAllEnvVars();


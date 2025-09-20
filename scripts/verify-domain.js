#!/usr/bin/env node

/**
 * ShipPort Domain Verification Script
 * This script helps verify your custom domain setup
 */

const https = require('https')
const http = require('http')
const { URL } = require('url')

async function checkDomainHealth(domain) {
  console.log(`🔍 Checking domain: ${domain}`)
  
  const results = {
    domain,
    https: false,
    ssl: false,
    redirect: false,
    responseTime: 0,
    statusCode: 0,
    error: null
  }
  
  try {
    const startTime = Date.now()
    
    return new Promise((resolve) => {
      const options = {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'ShipPort-Domain-Checker/1.0'
        }
      }
      
      const req = https.request(domain, options, (res) => {
        results.https = true
        results.ssl = true
        results.statusCode = res.statusCode
        results.responseTime = Date.now() - startTime
        
        // Check for redirects
        if (res.statusCode >= 300 && res.statusCode < 400) {
          results.redirect = true
        }
        
        console.log(`✅ HTTPS: ${results.https}`)
        console.log(`🔒 SSL: ${results.ssl}`)
        console.log(`📊 Status: ${results.statusCode}`)
        console.log(`⏱️  Response time: ${results.responseTime}ms`)
        
        if (results.redirect) {
          console.log(`🔄 Redirect detected: ${res.statusCode}`)
        }
        
        resolve(results)
      })
      
      req.on('error', (error) => {
        results.error = error.message
        console.log(`❌ HTTPS failed: ${error.message}`)
        
        // Try HTTP as fallback
        console.log('🔄 Trying HTTP fallback...')
        checkHTTPFallback(domain).then(resolve)
      })
      
      req.on('timeout', () => {
        req.destroy()
        results.error = 'Request timeout'
        console.log('⏰ Request timeout')
        resolve(results)
      })
      
      req.end()
    })
  } catch (error) {
    results.error = error.message
    console.log(`❌ Error: ${error.message}`)
    return results
  }
}

async function checkHTTPFallback(domain) {
  const httpDomain = domain.replace('https://', 'http://')
  console.log(`🔍 Trying HTTP: ${httpDomain}`)
  
  const results = {
    domain: httpDomain,
    https: false,
    ssl: false,
    redirect: false,
    responseTime: 0,
    statusCode: 0,
    error: null
  }
  
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const req = http.request(httpDomain, { timeout: 10000 }, (res) => {
      results.statusCode = res.statusCode
      results.responseTime = Date.now() - startTime
      
      if (res.statusCode >= 300 && res.statusCode < 400) {
        results.redirect = true
      }
      
      console.log(`📊 HTTP Status: ${results.statusCode}`)
      console.log(`⏱️  Response time: ${results.responseTime}ms`)
      
      if (results.redirect) {
        console.log(`🔄 HTTP Redirect detected: ${res.statusCode}`)
      }
      
      resolve(results)
    })
    
    req.on('error', (error) => {
      results.error = error.message
      console.log(`❌ HTTP failed: ${error.message}`)
      resolve(results)
    })
    
    req.on('timeout', () => {
      req.destroy()
      results.error = 'Request timeout'
      console.log('⏰ HTTP request timeout')
      resolve(results)
    })
    
    req.end()
  })
}

async function checkSEOElements(domain) {
  console.log(`\n🔍 Checking SEO elements for: ${domain}`)
  
  try {
    const response = await fetch(domain)
    const html = await response.text()
    
    const checks = {
      title: /<title>(.*?)<\/title>/i.test(html),
      description: /<meta\s+name="description"\s+content="(.*?)"/i.test(html),
      keywords: /<meta\s+name="keywords"\s+content="(.*?)"/i.test(html),
      ogTitle: /<meta\s+property="og:title"\s+content="(.*?)"/i.test(html),
      ogDescription: /<meta\s+property="og:description"\s+content="(.*?)"/i.test(html),
      ogImage: /<meta\s+property="og:image"\s+content="(.*?)"/i.test(html),
      canonical: /<link\s+rel="canonical"\s+href="(.*?)"/i.test(html),
      robots: /<meta\s+name="robots"\s+content="(.*?)"/i.test(html),
      viewport: /<meta\s+name="viewport"\s+content="(.*?)"/i.test(html),
    }
    
    console.log('📋 SEO Elements Check:')
    Object.entries(checks).forEach(([key, found]) => {
      console.log(`   ${found ? '✅' : '❌'} ${key}`)
    })
    
    return checks
  } catch (error) {
    console.log(`❌ SEO check failed: ${error.message}`)
    return null
  }
}

async function generateDomainReport(domain) {
  console.log('🌐 ShipPort Domain Verification Report')
  console.log('=====================================\n')
  
  if (!domain) {
    console.log('❌ Please provide a domain to check')
    console.log('Usage: node scripts/verify-domain.js https://yourdomain.com')
    return
  }
  
  // Ensure domain has protocol
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    domain = 'https://' + domain
  }
  
  const healthResults = await checkDomainHealth(domain)
  const seoResults = await checkSEOElements(domain)
  
  console.log('\n📋 Summary:')
  console.log(`Domain: ${domain}`)
  console.log(`HTTPS: ${healthResults.https ? '✅' : '❌'}`)
  console.log(`SSL Certificate: ${healthResults.ssl ? '✅' : '❌'}`)
  console.log(`Response Time: ${healthResults.responseTime}ms`)
  console.log(`Status Code: ${healthResults.statusCode}`)
  
  if (healthResults.error) {
    console.log(`Error: ${healthResults.error}`)
  }
  
  console.log('\n💡 Recommendations:')
  
  if (!healthResults.https) {
    console.log('- Enable HTTPS/SSL certificate')
  }
  
  if (healthResults.responseTime > 3000) {
    console.log('- Optimize response time (currently >3s)')
  }
  
  if (healthResults.statusCode !== 200) {
    console.log(`- Fix HTTP status code (currently ${healthResults.statusCode})`)
  }
  
  if (seoResults) {
    const missingElements = Object.entries(seoResults)
      .filter(([_, found]) => !found)
      .map(([key, _]) => key)
    
    if (missingElements.length > 0) {
      console.log(`- Add missing SEO elements: ${missingElements.join(', ')}`)
    }
  }
  
  console.log('\n🎉 Domain verification complete!')
}

// Run the domain check
if (require.main === module) {
  const domain = process.argv[2]
  generateDomainReport(domain)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Domain verification failed:', error)
      process.exit(1)
    })
}

module.exports = { generateDomainReport }

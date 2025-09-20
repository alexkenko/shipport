# ShipPort Deployment Guide

This guide will help you deploy the ShipPort application to production.

## Prerequisites

1. **GitHub Repository**: Your code should be in the `shipport` repository on GitHub
2. **Supabase Project**: Set up with the database schema and environment variables
3. **Domain (Optional)**: For custom domain setup

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments.

#### Steps:

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your `shipport` repository

2. **Configure Environment Variables**
   In Vercel dashboard, go to your project settings and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like `https://shipport-xxx.vercel.app`

4. **Custom Domain (Optional)**
   - In Vercel dashboard, go to "Domains"
   - Add your custom domain
   - Configure DNS settings as instructed

### Option 2: Netlify

#### Steps:

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with your GitHub account
   - Click "New site from Git"
   - Choose your `shipport` repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   In Netlify dashboard, go to Site settings > Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your app

### Option 3: Railway

Railway provides full-stack deployment with database hosting.

#### Steps:

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your `shipport` repository

2. **Environment Variables**
   In Railway dashboard, go to Variables tab:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**
   - Railway will automatically detect Next.js and deploy
   - You'll get a URL like `https://shipport-production.up.railway.app`

## Database Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Migrations**
   
   Copy and run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Enable necessary extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Create users table
   CREATE TABLE IF NOT EXISTS users (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       email VARCHAR(255) UNIQUE NOT NULL,
       role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'superintendent')),
       name VARCHAR(100) NOT NULL,
       surname VARCHAR(100) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       company VARCHAR(200) NOT NULL,
       bio TEXT,
       photo_url TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create manager_profiles table
   CREATE TABLE IF NOT EXISTS manager_profiles (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       vessel_types TEXT[] DEFAULT '{}',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       UNIQUE(user_id)
   );

   -- Create superintendent_profiles table
   CREATE TABLE IF NOT EXISTS superintendent_profiles (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       vessel_types TEXT[] DEFAULT '{}',
       certifications TEXT[] DEFAULT '{}',
       ports_covered TEXT[] DEFAULT '{}',
       services TEXT[] DEFAULT '{}',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       UNIQUE(user_id)
   );

   -- Create jobs table
   CREATE TABLE IF NOT EXISTS jobs (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       title VARCHAR(200) NOT NULL,
       description TEXT NOT NULL,
       port_name VARCHAR(100) NOT NULL,
       attendance_type VARCHAR(100) NOT NULL,
       vessel_type VARCHAR(100) NOT NULL,
       start_date DATE NOT NULL,
       end_date DATE NOT NULL,
       status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create job_applications table
   CREATE TABLE IF NOT EXISTS job_applications (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
       superintendent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
       message TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       UNIQUE(job_id, superintendent_id)
   );

   -- Create notifications table
   CREATE TABLE IF NOT EXISTS notifications (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       type VARCHAR(50) NOT NULL CHECK (type IN ('job_application', 'job_interest', 'profile_view')),
       title VARCHAR(200) NOT NULL,
       message TEXT NOT NULL,
       is_read BOOLEAN DEFAULT FALSE,
       related_id UUID,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create ports table
   CREATE TABLE IF NOT EXISTS ports (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name VARCHAR(200) NOT NULL,
       country VARCHAR(100) NOT NULL,
       city VARCHAR(100) NOT NULL,
       code VARCHAR(10) UNIQUE,
       coordinates JSONB,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
   CREATE INDEX IF NOT EXISTS idx_jobs_manager_id ON jobs(manager_id);
   CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
   CREATE INDEX IF NOT EXISTS idx_jobs_port_name ON jobs(port_name);
   CREATE INDEX IF NOT EXISTS idx_jobs_attendance_type ON jobs(attendance_type);
   CREATE INDEX IF NOT EXISTS idx_jobs_vessel_type ON jobs(vessel_type);
   CREATE INDEX IF NOT EXISTS idx_jobs_start_date ON jobs(start_date);
   CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
   CREATE INDEX IF NOT EXISTS idx_job_applications_superintendent_id ON job_applications(superintendent_id);
   CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
   CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
   CREATE INDEX IF NOT EXISTS idx_ports_name ON ports(name);
   CREATE INDEX IF NOT EXISTS idx_ports_country ON ports(country);
   CREATE INDEX IF NOT EXISTS idx_ports_city ON ports(city);
   ```

3. **Enable Authentication**
   - Go to Authentication > Settings in Supabase dashboard
   - Enable Email authentication
   - Configure email templates if needed

4. **Set up Storage (Optional)**
   - Go to Storage in Supabase dashboard
   - Create a bucket called "profile-photos"
   - Set up RLS policies for public access

## Environment Variables

Create a `.env.local` file in your project root (for local development):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xumhixssblldxhteyakk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWhpeHNzYmxsZHhodGV5YWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTg0MTUsImV4cCI6MjA3MzkzNDQxNX0.WcIb_9hvXW9VARkO-V8EgltsUUMfXQRGa2xtrAt5KU8
```

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shipport.git
   cd shipport
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Production Checklist

- [ ] Database schema is deployed
- [ ] Environment variables are set
- [ ] Authentication is enabled
- [ ] Storage bucket is created (if using photo uploads)
- [ ] Domain is configured (if using custom domain)
- [ ] SSL certificate is active
- [ ] Analytics are set up (optional)

## Monitoring and Maintenance

### Performance Monitoring
- Set up Vercel Analytics (if using Vercel)
- Monitor database performance in Supabase
- Set up error tracking (Sentry, Bugsnag)

### Regular Maintenance
- Update dependencies regularly
- Monitor database size and performance
- Review and update security settings
- Backup database regularly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify Supabase URL and keys are correct
   - Check if authentication is enabled in Supabase
   - Verify email templates are configured

3. **Database Connection Issues**
   - Check Supabase project is active
   - Verify database URL is correct
   - Check if RLS policies are configured properly

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)
- Check deployment platform documentation (Vercel, Netlify, etc.)

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use strong, unique keys for production
   - Rotate keys regularly

2. **Database Security**
   - Enable Row Level Security (RLS) in Supabase
   - Set up proper RLS policies
   - Monitor database access logs

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement proper CORS policies
   - Set up security headers

## Backup Strategy

1. **Database Backups**
   - Supabase provides automatic backups
   - Consider setting up additional backup strategies
   - Test backup restoration procedures

2. **Code Backups**
   - Use Git for version control
   - Consider mirror repositories
   - Document deployment procedures

## Scaling Considerations

As your application grows:

1. **Database Optimization**
   - Monitor query performance
   - Add indexes as needed
   - Consider database connection pooling

2. **CDN and Caching**
   - Use Vercel's Edge Network (if using Vercel)
   - Implement proper caching strategies
   - Optimize images and assets

3. **Monitoring**
   - Set up application monitoring
   - Monitor database performance
   - Track user analytics

Your ShipPort application is now ready for production deployment! 🚢

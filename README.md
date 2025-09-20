# ShipPort - Marine Superintendent Services Platform

ShipPort is a professional web application that connects Vessel Managers with Consulting Marine Superintendents. The platform facilitates the matching of maritime professionals with vessel management needs through a comprehensive job posting and application system.

## Features

### For Vessel Managers
- **Dashboard**: Overview of active jobs, applications, and completed assignments
- **Job Posting**: Create detailed job postings with specific requirements
- **My Posts**: Manage and track all job postings with application counts
- **Search Superintendents**: Find qualified superintendents based on expertise and location
- **Profile Management**: Complete company profile with vessel types managed
- **Notifications**: Real-time updates on job applications and superintendent interest

### For Marine Superintendents
- **Dashboard**: Track applications, completed jobs, and profile views
- **Job Search**: Find opportunities with advanced filtering options
- **My Applications**: Monitor application status and manage responses
- **Profile Management**: Comprehensive profile with certifications, services, and service areas
- **Notifications**: Get notified of job matches and manager interest

### Key Features
- **Role-based Authentication**: Secure login system with different user types
- **Advanced Search & Filtering**: Find opportunities by port, vessel type, attendance type, and date range
- **Comprehensive Port Database**: Global port coverage for accurate location matching
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **iPhone-style Date Picker**: Native mobile date selection experience
- **Real-time Notifications**: Instant updates on job applications and interest
- **SEO Optimized**: Long-tail keywords for marine industry search visibility

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom marine theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Headless UI
- **Date Handling**: React DatePicker with mobile optimization
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shipport
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Run the SQL migrations in your Supabase dashboard:
   
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

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
shipport/
├── app/                          # Next.js 14 app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Dashboard pages
│   │   ├── manager/              # Manager-specific pages
│   │   └── superintendent/       # Superintendent-specific pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── ui/                       # Basic UI components
│   └── layout/                   # Layout components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication functions
│   └── supabase.ts               # Supabase client
├── types/                        # TypeScript type definitions
│   └── index.ts
├── sql/                          # Database migration files
└── README.md
```

## Key Features Implementation

### SEO Optimization
- Long-tail keywords targeting marine industry searches
- Meta tags optimized for "marine superintendent", "vessel manager", "ISM audit", etc.
- Structured data for better search engine visibility
- Mobile-first responsive design

### Mobile Responsiveness
- iPhone-style date picker for mobile devices
- Touch-friendly interface elements
- Responsive grid layouts
- Mobile-optimized navigation

### Authentication & Authorization
- Role-based access control (Manager vs Superintendent)
- Secure password authentication via Supabase
- Protected routes with automatic redirects
- Session management

### Database Design
- Normalized schema with proper relationships
- Comprehensive port database with global coverage
- Optimized indexes for search performance
- Real-time notifications system

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: App Platform deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Advanced filtering and search algorithms
- [ ] Video profile introductions
- [ ] Rating and review system
- [ ] Integration with maritime industry databases
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

-- Blog system tables for SEO-optimized content management

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for category display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(255), -- SEO meta title
    meta_description TEXT, -- SEO meta description
    tags TEXT[], -- Array of tags for better categorization
    reading_time INTEGER, -- Estimated reading time in minutes
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog post SEO data table for additional structured data
CREATE TABLE IF NOT EXISTS blog_seo_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    schema_type VARCHAR(50) DEFAULT 'Article', -- Article, HowTo, NewsArticle, etc.
    json_ld_data JSONB, -- Structured data in JSON-LD format
    focus_keyword VARCHAR(100), -- Primary keyword for SEO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_seo_data_updated_at 
    BEFORE UPDATE ON blog_seo_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Marine Industry News', 'marine-industry-news', 'Latest news and updates from the maritime industry', '#3B82F6'),
('Marine Superintendent Guides', 'marine-superintendent-guides', 'Comprehensive guides for marine superintendents', '#10B981'),
('Port State Control', 'port-state-control', 'Everything about PSC inspections and compliance', '#F59E0B'),
('Vessel Inspections', 'vessel-inspections', 'Ship inspection procedures and best practices', '#EF4444'),
('Career Development', 'career-development', 'Career advice and development for maritime professionals', '#8B5CF6'),
('Regulations & Compliance', 'regulations-compliance', 'Maritime regulations and compliance requirements', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author_id, category_id, status, published_at, meta_title, meta_description, tags, reading_time) VALUES
(
    'Complete Guide to Port State Control Inspections in 2025',
    'complete-guide-port-state-control-inspections-2025',
    'Everything you need to know about PSC inspections, common deficiencies, and how to prepare your vessel for a successful inspection.',
    'Port State Control (PSC) inspections are crucial for maintaining vessel safety and compliance with international maritime regulations. In this comprehensive guide, we''ll cover everything from preparation strategies to common deficiencies and how to avoid them.

## Understanding Port State Control

Port State Control is the inspection of foreign ships in national ports to verify that the condition of the ship and its equipment comply with the requirements of international conventions and that the ship is manned and operated in compliance with applicable international laws.

### Key PSC Regions

- **Paris MOU**: European and North Atlantic region
- **Tokyo MOU**: Asia-Pacific region  
- **US Coast Guard**: United States waters
- **Caribbean MOU**: Caribbean region

## Common PSC Deficiencies

### 1. Safety Equipment
- Lifeboat equipment not properly maintained
- Fire-fighting equipment deficiencies
- Emergency lighting system failures

### 2. Navigation Equipment
- GPS system malfunctions
- Radar equipment not functioning
- AIS transponder issues

### 3. Documentation
- Missing or expired certificates
- Incomplete crew documentation
- Outdated safety management system

## Preparation Checklist

1. **Pre-arrival Inspection**
   - Conduct thorough internal inspection
   - Check all safety equipment
   - Verify documentation completeness

2. **Crew Briefing**
   - Ensure all crew understand procedures
   - Brief on emergency equipment locations
   - Review safety protocols

3. **Documentation Review**
   - Verify all certificates are valid
   - Check crew qualifications
   - Ensure SMS is up to date

## Best Practices for Success

- Maintain regular equipment testing schedules
- Keep detailed maintenance records
- Train crew on proper procedures
- Stay updated with regulation changes

By following these guidelines, you can significantly improve your chances of passing PSC inspections and maintaining a clean inspection record.',
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1),
    (SELECT id FROM blog_categories WHERE slug = 'port-state-control'),
    'published',
    NOW() - INTERVAL '2 days',
    'Port State Control Inspections Guide 2025 | Marine Superintendent Tips',
    'Complete guide to PSC inspections, common deficiencies, and preparation strategies. Expert tips from marine superintendents for successful vessel inspections.',
    ARRAY['PSC', 'inspections', 'maritime safety', 'compliance', 'vessel preparation'],
    8
),
(
    'Marine Superintendent Career Path: From Cadet to Expert',
    'marine-superintendent-career-path-cadet-to-expert',
    'Discover the complete career journey of a marine superintendent, from starting as a cadet to becoming an industry expert with valuable insights and advice.',
    'The marine superintendent career path is one of the most rewarding in the maritime industry. This comprehensive guide will walk you through every step of the journey, from your first day as a cadet to becoming a recognized expert in the field.

## Starting Your Journey: The Cadet Phase

### Educational Requirements
- Maritime academy degree or equivalent
- STCW certifications
- Basic safety training completion

### Key Skills to Develop
- Technical knowledge of vessel systems
- Understanding of maritime regulations
- Communication and leadership skills

## Early Career: Junior Officer to Senior Officer

### Progression Timeline
- **0-2 years**: Junior Officer (3rd/2nd Officer)
- **2-5 years**: Senior Officer (Chief Officer)
- **5-8 years**: Chief Officer to Superintendent

### Essential Certifications
- Advanced STCW courses
- Management level certificates
- Specialized training (ISM, ISPS, MLC)

## Mid-Career: Becoming a Superintendent

### Key Responsibilities
- Vessel inspections and audits
- Crew management and training
- Regulatory compliance oversight
- Technical support and troubleshooting

### Skills Development
- Project management
- Risk assessment
- Client relationship management
- Technical problem-solving

## Senior Level: Industry Expert

### Advanced Roles
- Senior Marine Superintendent
- Fleet Manager
- Technical Director
- Marine Consultant

### Continuous Learning
- Industry conferences and seminars
- Advanced certifications
- Mentoring junior professionals
- Contributing to industry standards

## Career Advancement Tips

1. **Build Your Network**
   - Join professional associations
   - Attend industry events
   - Connect with experienced superintendents

2. **Develop Specializations**
   - Focus on specific vessel types
   - Become expert in particular regulations
   - Build expertise in emerging technologies

3. **Stay Updated**
   - Follow industry news and trends
   - Participate in training programs
   - Read technical publications

4. **Build Your Reputation**
   - Deliver quality work consistently
   - Share knowledge with others
   - Maintain professional relationships

The marine superintendent career path offers excellent opportunities for growth, both professionally and financially. With dedication, continuous learning, and the right approach, you can build a successful and rewarding career in this dynamic field.',
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1),
    (SELECT id FROM blog_categories WHERE slug = 'career-development'),
    'published',
    NOW() - INTERVAL '1 day',
    'Marine Superintendent Career Path | Complete Guide 2025',
    'Complete guide to marine superintendent career development from cadet to expert. Learn about progression, certifications, and advancement strategies.',
    ARRAY['career development', 'marine superintendent', 'maritime career', 'professional growth'],
    12
),
(
    'SIRE 2.0 Vetting: Complete Preparation Guide for Tanker Vessels',
    'sire-2-0-vetting-preparation-guide-tanker-vessels',
    'Master the SIRE 2.0 vetting process with our comprehensive preparation guide. Learn about new requirements, common pitfalls, and success strategies.',
    'SIRE 2.0 represents a significant evolution in tanker vessel vetting, introducing new inspection protocols and enhanced safety requirements. This guide will help you navigate the updated system and ensure your vessel passes with flying colors.

## Understanding SIRE 2.0

### What''s New in SIRE 2.0
- Enhanced digital reporting system
- Updated inspection criteria
- Improved risk assessment methodology
- Streamlined documentation requirements

### Key Changes from SIRE 1.0
- More detailed technical inspections
- Enhanced crew competency assessments
- Improved environmental compliance checks
- Better integration with port state control

## Pre-Inspection Preparation

### Documentation Checklist
- Valid certificates and permits
- Updated safety management system
- Crew qualification records
- Maintenance and repair logs
- Environmental compliance records

### Technical Preparation
- Engine room inspection readiness
- Cargo handling system checks
- Safety equipment verification
- Navigation system testing

## Common SIRE 2.0 Deficiencies

### 1. Safety Management System Issues
- Incomplete risk assessments
- Outdated procedures
- Insufficient crew training records

### 2. Technical Deficiencies
- Engine room maintenance issues
- Cargo system problems
- Safety equipment malfunctions

### 3. Crew Competency Gaps
- Insufficient training records
- Language barrier issues
- Inadequate emergency response knowledge

## Success Strategies

### 1. Comprehensive Preparation
- Conduct thorough internal audits
- Address all identified deficiencies
- Ensure crew is well-trained and prepared

### 2. Documentation Excellence
- Maintain detailed records
- Keep certificates up to date
- Document all maintenance activities

### 3. Crew Training
- Regular safety drills
- Emergency response training
- Technical competency assessments

## Post-Inspection Follow-up

### Addressing Deficiencies
- Develop corrective action plans
- Implement necessary improvements
- Monitor progress and effectiveness

### Continuous Improvement
- Regular internal audits
- Crew feedback integration
- Process optimization

By following this comprehensive guide, you can significantly improve your chances of success in SIRE 2.0 vetting and maintain the highest standards of vessel safety and compliance.',
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1),
    (SELECT id FROM blog_categories WHERE slug = 'vessel-inspections'),
    'published',
    NOW(),
    'SIRE 2.0 Vetting Preparation Guide | Tanker Vessel Inspection Tips',
    'Complete SIRE 2.0 vetting preparation guide for tanker vessels. Learn new requirements, common deficiencies, and success strategies from experts.',
    ARRAY['SIRE 2.0', 'tanker vetting', 'vessel inspection', 'maritime safety'],
    10
)
ON CONFLICT (slug) DO NOTHING;

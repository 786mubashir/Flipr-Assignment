const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./models/Project');
const Client = require('./models/Client');
const Newsletter = require('./models/Newsletter');

// Sample data
const sampleProjects = [
  {
    name: 'E-Commerce Platform',
    description: 'A modern e-commerce platform with real-time inventory management, secure payment processing, and comprehensive admin dashboard. Built with React and Node.js, featuring responsive design and mobile-first approach.',
    image: 'https://via.placeholder.com/450x350/667eea/ffffff?text=E-Commerce+Platform'
  },
  {
    name: 'Social Media Dashboard',
    description: 'An analytics dashboard for social media management. Features include content scheduling, engagement tracking, performance analytics, and multi-platform integration. Perfect for digital marketing teams.',
    image: 'https://via.placeholder.com/450x350/764ba2/ffffff?text=Social+Media+Dashboard'
  },
  {
    name: 'Healthcare Management System',
    description: 'A comprehensive healthcare management system for clinics and hospitals. Includes patient records management, appointment scheduling, billing, and reporting features. HIPAA compliant and secure.',
    image: 'https://via.placeholder.com/450x350/f093fb/ffffff?text=Healthcare+System'
  },
  {
    name: 'Educational Learning Platform',
    description: 'An interactive online learning platform with video courses, quizzes, assignments, and progress tracking. Supports multiple instructors and students with real-time collaboration features.',
    image: 'https://via.placeholder.com/450x350/4facfe/ffffff?text=Learning+Platform'
  },
  {
    name: 'Food Delivery App',
    description: 'A mobile-first food delivery application with real-time order tracking, restaurant management, payment integration, and delivery driver allocation. Available on iOS and Android.',
    image: 'https://via.placeholder.com/450x350/43e97b/ffffff?text=Food+Delivery+App'
  },
  {
    name: 'Real Estate Listings',
    description: 'A property listing platform with advanced search filters, virtual tour integration, mortgage calculator, and agent matching. Features map-based search and saved property favorites.',
    image: 'https://via.placeholder.com/450x350/fa709a/ffffff?text=Real+Estate+Listings'
  }
];

const sampleClients = [
  {
    name: 'Sarah Johnson',
    designation: 'CEO, TechCorp Solutions',
    description: 'The team delivered an outstanding e-commerce platform that exceeded our expectations. Their attention to detail and commitment to quality is remarkable. Our sales have increased by 40% since launch!',
    image: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Michael Chen',
    designation: 'Marketing Director, Digital Innovations',
    description: 'Working with this team was a game-changer for our marketing efforts. The social media dashboard they built has streamlined our workflow and improved our campaign performance significantly.',
    image: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'Dr. Emily Rodriguez',
    designation: 'Chief Medical Officer, HealthCare Plus',
    description: 'The healthcare management system transformed how we handle patient care. It\'s intuitive, efficient, and has improved our clinic\'s productivity. Highly recommended!',
    image: 'https://i.pravatar.cc/150?img=9'
  },
  {
    name: 'David Thompson',
    designation: 'Founder, EduLearn Academy',
    description: 'Our learning platform has reached thousands of students worldwide. The team\'s expertise in educational technology is exceptional, and they delivered beyond our vision.',
    image: 'https://i.pravatar.cc/150?img=13'
  },
  {
    name: 'Lisa Anderson',
    designation: 'Operations Manager, FoodExpress',
    description: 'The food delivery app has revolutionized our business operations. User-friendly interface, reliable performance, and excellent customer support. Our delivery times improved by 30%!',
    image: 'https://i.pravatar.cc/150?img=47'
  },
  {
    name: 'Robert Martinez',
    designation: 'Real Estate Broker, Prime Properties',
    description: 'The property listing platform has made finding and showcasing properties so much easier. Our agents love it, and our clients appreciate the smooth experience. Great work!',
    image: 'https://i.pravatar.cc/150?img=33'
  }
];

const sampleNewsletters = [
  { email: 'subscriber1@example.com' },
  { email: 'subscriber2@example.com' },
  { email: 'subscriber3@example.com' },
  { email: 'subscriber4@example.com' },
  { email: 'subscriber5@example.com' },
  { email: 'john.doe@email.com' },
  { email: 'jane.smith@email.com' },
  { email: 'contact@business.com' }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected for seeding...');
  seedDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('Clearing existing data...');
    await Project.deleteMany({});
    await Client.deleteMany({});
    await Newsletter.deleteMany({});

    // Insert sample projects
    console.log('Adding sample projects...');
    const projects = await Project.insertMany(sampleProjects);
    console.log(`✅ Added ${projects.length} projects`);

    // Insert sample clients
    console.log('Adding sample clients...');
    const clients = await Client.insertMany(sampleClients);
    console.log(`✅ Added ${clients.length} clients`);

    // Insert sample newsletters
    console.log('Adding sample newsletter subscriptions...');
    const newsletters = await Newsletter.insertMany(sampleNewsletters);
    console.log(`✅ Added ${newsletters.length} newsletter subscriptions`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Clients: ${clients.length}`);
    console.log(`- Newsletter Subscriptions: ${newsletters.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}


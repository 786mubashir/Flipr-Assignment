const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Project = require('./models/Project');
const Client = require('./models/Client');
const { cropImage } = require('./utils/imageCropper');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Image URLs to download (using reliable image sources)
const projectImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // E-commerce
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', // Dashboard
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80', // Healthcare
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', // Education
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', // Food
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'  // Real Estate
];

const clientImages = [
  'https://i.pravatar.cc/450?img=1',
  'https://i.pravatar.cc/450?img=12',
  'https://i.pravatar.cc/450?img=9',
  'https://i.pravatar.cc/450?img=13',
  'https://i.pravatar.cc/450?img=47',
  'https://i.pravatar.cc/450?img=33'
];

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected for seeding with images...');
  seedDatabaseWithImages();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabaseWithImages() {
  try {
    console.log('Clearing existing data...');
    await Project.deleteMany({});
    await Client.deleteMany({});

    // Download and crop project images
    console.log('Downloading and cropping project images...');
    const projectImageFiles = [];
    for (let i = 0; i < projectImages.length; i++) {
      const originalFilename = `project-original-${i + 1}.jpg`;
      const croppedFilename = `cropped-project-${i + 1}.jpg`;
      const originalPath = path.join(uploadsDir, originalFilename);
      const croppedPath = path.join(uploadsDir, croppedFilename);
      try {
        await downloadImage(projectImages[i], originalPath);
        // Crop image to 450x350
        await cropImage(originalPath, croppedPath);
        // Delete original
        if (fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }
        projectImageFiles.push(`/uploads/${croppedFilename}`);
        console.log(`  ✓ Downloaded and cropped project-${i + 1}.jpg`);
      } catch (error) {
        console.log(`  ✗ Failed to process project image ${i + 1}: ${error.message}`);
        // Clean up on error
        if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
        if (fs.existsSync(croppedPath)) fs.unlinkSync(croppedPath);
        projectImageFiles.push(projectImages[i]);
      }
    }

    // Download and crop client images
    console.log('Downloading and cropping client images...');
    const clientImageFiles = [];
    for (let i = 0; i < clientImages.length; i++) {
      const originalFilename = `client-original-${i + 1}.jpg`;
      const croppedFilename = `cropped-client-${i + 1}.jpg`;
      const originalPath = path.join(uploadsDir, originalFilename);
      const croppedPath = path.join(uploadsDir, croppedFilename);
      try {
        await downloadImage(clientImages[i], originalPath);
        // Crop image to 450x350
        await cropImage(originalPath, croppedPath);
        // Delete original
        if (fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }
        clientImageFiles.push(`/uploads/${croppedFilename}`);
        console.log(`  ✓ Downloaded and cropped client-${i + 1}.jpg`);
      } catch (error) {
        console.log(`  ✗ Failed to process client image ${i + 1}: ${error.message}`);
        // Clean up on error
        if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
        if (fs.existsSync(croppedPath)) fs.unlinkSync(croppedPath);
        clientImageFiles.push(clientImages[i]);
      }
    }

    // Sample projects with downloaded images
    const sampleProjects = [
      {
        name: 'E-Commerce Platform',
        description: 'A modern e-commerce platform with real-time inventory management, secure payment processing, and comprehensive admin dashboard. Built with React and Node.js, featuring responsive design and mobile-first approach.',
        image: projectImageFiles[0]
      },
      {
        name: 'Social Media Dashboard',
        description: 'An analytics dashboard for social media management. Features include content scheduling, engagement tracking, performance analytics, and multi-platform integration. Perfect for digital marketing teams.',
        image: projectImageFiles[1]
      },
      {
        name: 'Healthcare Management System',
        description: 'A comprehensive healthcare management system for clinics and hospitals. Includes patient records management, appointment scheduling, billing, and reporting features. HIPAA compliant and secure.',
        image: projectImageFiles[2]
      },
      {
        name: 'Educational Learning Platform',
        description: 'An interactive online learning platform with video courses, quizzes, assignments, and progress tracking. Supports multiple instructors and students with real-time collaboration features.',
        image: projectImageFiles[3]
      },
      {
        name: 'Food Delivery App',
        description: 'A mobile-first food delivery application with real-time order tracking, restaurant management, payment integration, and delivery driver allocation. Available on iOS and Android.',
        image: projectImageFiles[4]
      },
      {
        name: 'Real Estate Listings',
        description: 'A property listing platform with advanced search filters, virtual tour integration, mortgage calculator, and agent matching. Features map-based search and saved property favorites.',
        image: projectImageFiles[5]
      }
    ];

    // Sample clients with downloaded images
    const sampleClients = [
      {
        name: 'Sarah Johnson',
        designation: 'CEO, TechCorp Solutions',
        description: 'The team delivered an outstanding e-commerce platform that exceeded our expectations. Their attention to detail and commitment to quality is remarkable. Our sales have increased by 40% since launch!',
        image: clientImageFiles[0]
      },
      {
        name: 'Michael Chen',
        designation: 'Marketing Director, Digital Innovations',
        description: 'Working with this team was a game-changer for our marketing efforts. The social media dashboard they built has streamlined our workflow and improved our campaign performance significantly.',
        image: clientImageFiles[1]
      },
      {
        name: 'Dr. Emily Rodriguez',
        designation: 'Chief Medical Officer, HealthCare Plus',
        description: 'The healthcare management system transformed how we handle patient care. It\'s intuitive, efficient, and has improved our clinic\'s productivity. Highly recommended!',
        image: clientImageFiles[2]
      },
      {
        name: 'David Thompson',
        designation: 'Founder, EduLearn Academy',
        description: 'Our learning platform has reached thousands of students worldwide. The team\'s expertise in educational technology is exceptional, and they delivered beyond our vision.',
        image: clientImageFiles[3]
      },
      {
        name: 'Lisa Anderson',
        designation: 'Operations Manager, FoodExpress',
        description: 'The food delivery app has revolutionized our business operations. User-friendly interface, reliable performance, and excellent customer support. Our delivery times improved by 30%!',
        image: clientImageFiles[4]
      },
      {
        name: 'Robert Martinez',
        designation: 'Real Estate Broker, Prime Properties',
        description: 'The property listing platform has made finding and showcasing properties so much easier. Our agents love it, and our clients appreciate the smooth experience. Great work!',
        image: clientImageFiles[5]
      }
    ];

    // Insert projects
    console.log('\nAdding projects to database...');
    const projects = await Project.insertMany(sampleProjects);
    console.log(`✅ Added ${projects.length} projects`);

    // Insert clients
    console.log('Adding clients to database...');
    const clients = await Client.insertMany(sampleClients);
    console.log(`✅ Added ${clients.length} clients`);

    console.log('\n🎉 Database seeding with images completed successfully!');
    console.log('\nSummary:');
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Clients: ${clients.length}`);
    console.log(`- Images downloaded to: ${uploadsDir}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}


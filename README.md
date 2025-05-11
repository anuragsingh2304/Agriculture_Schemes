# Farmer Schemes Portal

![Farmer Schemes Portal Logo](/public/images/logo.png)

## Overview

The Farmer Schemes Portal is a comprehensive platform designed to connect farmers with government agricultural schemes and resources. This platform bridges the gap between farmers and government initiatives by providing easy access to scheme information, application processes, and agricultural resources.

## Features

### For Farmers
- **Scheme Discovery**: Browse and search through various central and state agricultural schemes
- **Scheme Comparison**: Compare different schemes to find the most suitable options
- **Online Application**: Apply for schemes directly through the portal
- **Document Management**: Upload and manage required documents
- **Application Tracking**: Track application status in real-time
- **User Dashboard**: Personalized dashboard showing applied schemes and application status
- **Crop Information**: Access detailed information about various crops
- **Profile Management**: Manage personal and bank details

### For Administrators
- **Scheme Management**: Add, edit, and manage scheme information
- **Application Processing**: Review, approve, or reject scheme applications
- **User Management**: Manage farmer accounts and profiles
- **Crop Database**: Maintain and update crop information
- **Analytics Dashboard**: View statistics on scheme applications and approvals
- **Document Verification**: Verify uploaded documents

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Instructions

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/farmer-schemes-portal.git
   cd farmer-schemes-portal
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=your_api_url
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   \`\`\`

4. Run the development server
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

\`\`\`
farmer-schemes-portal/
├── app/                    # Next.js app directory
│   ├── admin/              # Admin pages
│   ├── apply/              # Scheme application pages
│   ├── crops/              # Crop information pages
│   ├── schemes/            # Scheme listing pages
│   ├── user/               # User dashboard and profile pages
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Page footer
│   ├── Sidebar.tsx         # Dashboard sidebar
│   ├── SchemeCard.tsx      # Scheme display card
│   └── ...                 # Other components
├── public/                 # Static assets
│   └── images/             # Image files
├── utils/                  # Utility functions
│   ├── mockdata.ts         # Mock data for development
│   └── theme.ts            # Theme configuration
├── .env.local              # Environment variables (create this file)
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md               # Project documentation
\`\`\`

## Technologies Used

- **Frontend**:
  - Next.js 14 (React framework)
  - TypeScript
  - Tailwind CSS for styling
  - React Hook Form for form handling

- **State Management**:
  - React Context API
  - React Hooks

- **Authentication**:
  - JWT (JSON Web Tokens)
  - HTTP-only cookies for token storage

- **UI Components**:
  - Custom components
  - Responsive design for mobile and desktop

## Usage Guide

### Farmer User Flow

1. **Registration/Login**:
   - Create a new account or log in with existing credentials
   - Complete profile information including personal and bank details

2. **Discovering Schemes**:
   - Browse schemes on the home page or schemes section
   - Use filters to find schemes by category, state, or eligibility
   - View detailed information about each scheme

3. **Applying for Schemes**:
   - Select a scheme and click "Apply"
   - Fill out the application form
   - Upload required documents
   - Submit application

4. **Tracking Applications**:
   - View all applications in the user dashboard
   - Check status (Pending, Approved, Rejected)
   - Receive notifications about application updates

### Administrator User Flow

1. **Login**:
   - Access the admin panel through the admin login page

2. **Managing Schemes**:
   - Add new schemes with details, eligibility criteria, and required documents
   - Edit existing scheme information
   - Activate or deactivate schemes

3. **Processing Applications**:
   - Review submitted applications
   - View uploaded documents
   - Approve or reject applications with comments
   - Track application statistics

## Contributing

We welcome contributions to improve the Farmer Schemes Portal! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact us at support@farmerschemes.org

---

© 2024 Farmer Schemes Portal. All Rights Reserved.

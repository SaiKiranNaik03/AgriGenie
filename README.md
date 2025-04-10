# AgriGenie - AI-Powered Agriculture Platform

AgriGenie is a comprehensive digital platform designed to connect farmers and buyers while providing AI-powered insights for agricultural decision-making. The platform leverages cutting-edge technology to revolutionize agricultural practices, market access, and crop management.

## Key Features

### Role-based Dashboards
- **Farmer Dashboard**: 
  - Crop health monitoring with AI-powered disease diagnosis
  - Activity calendar for farming tasks and events
  - Market price analytics for optimal selling decisions
  - Weather intelligence with crop suitability recommendations
  - AI Farming Assistant for personalized advice
  - Marketplace listings management

- **Buyer Dashboard**:
  - Browse and search marketplace listings
  - Order history and tracking
  - Market price trends and forecasts
  - AI-powered market insights
  - Weather impact on crop availability

### Marketplace
- **For Farmers**:
  - Create and manage crop listings with detailed specifications
  - Set pricing and availability
  - Track order status and manage deliveries
  - Receive notifications for new orders

- **For Buyers**:
  - Browse available crops with filtering options
  - View detailed product information
  - Place orders and track delivery status
  - Rate and review sellers

### AI Assistant (GeminiChat)
- **Conversational Interface**: Natural language interaction for farming queries
- **Specialized Tabs**:
  - **Chat**: General farming advice and information
  - **Farming**: Crop recommendations and farming techniques
  - **Market**: Price trends and market insights
  - **Disease**: Crop disease diagnosis and treatment options
- **Feedback System**: Rate responses to improve AI accuracy
- **Contextual Suggestions**: Pre-defined questions based on user role

### Weather Intelligence
- Real-time weather data for user's location
- 5-day weather forecasts
- Weather-based crop suitability analysis
- Alerts for adverse weather conditions
- Historical weather data for planning

### Market Price Analytics
- Real-time and historical crop prices
- Price trend visualization
- Forecasted price movements
- Regional price comparisons
- Supply and demand indicators

### Crop Health Monitoring
- AI-powered disease diagnosis from symptoms
- Treatment recommendations
- Health status tracking
- Historical assessment records
- Visual health indicators

### Activity Calendar
- Schedule farming activities
- Set reminders for important tasks
- Track completed activities
- Weather-aware scheduling
- Task categorization

## Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide icons

- **Backend**: 
  - Next.js API routes
  - Supabase (PostgreSQL)
  - Serverless functions

- **Authentication**: 
  - Supabase Auth
  - Role-based access control

- **APIs**: 
  - OpenWeather API for weather data
  - Google Gemini API for AI features
  - Market price data (simulated)

- **State Management**:
  - React Context API
  - Local storage for offline capabilities

## Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/SaiKiranNaik03/AgriGenie.git
   cd agrigenie
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # External API Keys
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your-openweather-api-key
   NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key  # For Gemini AI

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```
   npm run dev
   ```

5. **Open your browser and navigate to**
   ```
   http://localhost:3000
   ```

## Database Schema

The application uses Supabase with the following main tables:

- **profiles**: User profile information with role (farmer/buyer)
- **marketplace_listings**: Crop listings posted by farmers
- **marketplace_orders**: Orders placed by buyers
- **crop_assessments**: Records of crop health assessments
- **farming_activities**: Scheduled farming tasks and events
- **weather_data**: Cached weather information
- **market_prices**: Historical and current crop prices

## API Integration

### Weather API

The application integrates with OpenWeather API to provide:
- Current weather conditions
- 5-day forecasts
- Weather-based crop suitability analysis
- Weather alerts and notifications
- Historical weather data

### Gemini AI

Google's Gemini AI powers several features:
- Conversational farming assistant with natural language understanding
- Crop recommendations based on soil type, climate, and market demand
- Market trend analysis and price forecasting
- Disease diagnosis from symptom descriptions
- Personalized farming advice based on user's specific conditions

## Project Structure

```
agrigenie/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   └── marketplace/ # Marketplace pages
│   ├── components/      # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── marketplace/ # Marketplace components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── lib/             # Utility functions and hooks
│   └── types/           # TypeScript type definitions
├── .env.local           # Environment variables
└── package.json         # Project dependencies
```

## Deployment

The application can be deployed to Vercel or any other platform that supports Next.js applications.

```bash
npm run build
npm start
```

## Future Enhancements

- Mobile application for on-the-go access
- IoT integration for automated crop monitoring
- Blockchain-based supply chain tracking
- Advanced analytics dashboard
- Multi-language support
- Offline mode for rural areas with limited connectivity

## License

[MIT](LICENSE)

Project By - The ctrl+alt+elites
# PolicyPulse

A powerful policy simulation platform that helps governments and organizations understand the impact of policy decisions before implementation.

## 🚀 Features

- Real-time policy impact simulation
- Interactive data visualization
- Multiple policy templates
- Demographic impact analysis
- User-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Library**: Ant Design
- **Charts**: Recharts
- **Backend**: Node.js, Express
- **Database**: SQLite with Prisma
- **Authentication**: JWT

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PolicyPulse.git
   cd PolicyPulse
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in both `backend` and `frontend` directories with the required variables.

4. **Run the application**
   ```bash
   # Start backend
   cd backend
   npx prisma migrate dev
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Hacknomics Hackathon
- Thanks to all the open-source projects that made this possible

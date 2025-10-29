# PolicyPulse: Shaping the Future with Data-Driven Decisions

**Tagline:** Simulate, Analyze, and Understand the Real-World Impact of Policy

PolicyPulse is a powerful and intuitive platform designed to revolutionize how we approach public policy. It empowers policymakers, researchers, students, and engaged citizens to simulate the economic and social impacts of various policy decisions before implementation. By providing clear visualizations and comparative analysis, PolicyPulse helps in making more informed, evidence-based decisions and understanding the complex ripple effects of policy choices.

## 🚀 Features

-   **Real-time Policy Simulation:** Test policy changes and see their economic impact instantly with our advanced simulation engine.
-   **Comprehensive Impact Analysis:** Understand effects on GDP, employment, poverty, and specific demographics (e.g., income brackets).
-   **Scenario Comparison:** Compare multiple policy proposals side-by-side to identify optimal solutions and understand trade-offs.
-   **Dynamic Data Visualization:** Clear charts and graphs for easy interpretation of complex data.
-   **User Authentication:** Secure environment for saving and reviewing simulation history.
-   **Extensible Policy Library:** Easily add and configure new policy types and their simulation models.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **UI Library**: Ant Design
-   **Charts**: Recharts
-   **Backend**: Node.js, Express.js, TypeScript
-   **Database**: SQLite with Prisma ORM
-   **Authentication**: JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/PolicyPulse.git
    cd PolicyPulse
    ```

2.  **Install dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install
    
    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the `backend` directory with the following variable:
    ```
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-secret-key" # Replace with a strong, unique secret
    ```

4.  **Run the application**
    ```bash
    # Start backend (from the PolicyPulse/backend directory)
    cd backend
    npx prisma migrate dev --name init_and_simulation_models
    npm run dev
    
    # In a new terminal, start frontend (from the PolicyPulse/frontend directory)
    cd ../frontend
    npm run dev
    ```

5.  **Open in browser**
    -   Frontend: `http://localhost:5173` (or whatever port Vite assigns)
    -   Backend API: `http://localhost:5000`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Built for the Hacknomics Hackathon
-   Thanks to all the open-source projects that made this possible

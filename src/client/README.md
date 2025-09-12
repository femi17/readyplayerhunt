# 🎮 ReadyPlayerHunt

A mystical treasure hunt game that turns Reddit into your playground! Join Zephyrus, the Keeper of Secrets, on an epic quest to solve riddles and climb the Hall of Hunters.

## 🧙‍♂️ About the Game

ReadyPlayerHunt is an immersive daily challenge game where players solve riddles to find specific subreddits. Each day brings new mysteries, new challenges, and new opportunities to prove your Reddit knowledge and puzzle-solving skills.

### 🌟 Features

* **Daily Challenges**: Fresh riddles every day with time-limited competitions
* **Mystical Character**: Meet Zephyrus, the Keeper of Secrets, your guide through the hunt
* **Real-time Leaderboard**: Compete with other hunters and climb the ranks
* **Time-based Messages**: Personalized welcome messages based on when you join
* **Immersive Design**: Beautiful, responsive interface that fits any screen
* **No Scrolling Required**: Everything fits perfectly within the viewport

## 🎯 How to Play

### Getting Started

1. **Join the Hunt**: Click "ACCEPT THE QUEST" to begin your adventure
2. **Listen to Zephyrus**: The Keeper of Secrets will present you with a riddle
3. **Solve the Riddle**: Each riddle points to a specific subreddit on Reddit
4. **Submit Your Answer**: Enter the subreddit name (e.g., "r/wholesomememes")
5. **Earn Keys**: Correct answers earn you keys and points
6. **Climb the Ranks**: Compete with other hunters in the Hall of Hunters

### Game Flow

```
Welcome Screen → Accept Quest → Read Riddle → Submit Answer → View Results → Check Rankings
```

### 🏆 Scoring System

* **Keys**: Earned for each correct answer
* **Points**: Accumulated based on difficulty and speed
* **Rankings**: Based on total keys and points earned

### 🕐 Daily Challenge

* **24-Hour Cycles**: New challenges reset daily
* **Time-based Welcome**: Different messages based on when you join:
  * **Early** (12 AM - 9 AM): "The night is young and the hunt begins!"
  * **On Time** (9 AM - 9 PM): "Perfect timing for the hunt!"
  * **Late** (9 PM - 12 AM): "But there's still time to catch up!"

## 🎮 Game Screens

### Welcome Screen
* Meet Zephyrus, the Keeper of Secrets
* View the daily challenge timer
* Choose to accept the quest, learn how to play, or view rankings

### Clue Screen
* Read Zephyrus's riddle
* Navigate to submit answers or view rankings

### Puzzle Screen
* Submit your subreddit answer
* Get immediate feedback on your response
* Navigate back to clues or rankings

### Leaderboard Screen
* View top 5 hunters
* See your current position
* Track your progress

### How to Play Screen
* Learn the game mechanics
* Understand the scoring system
* Get tips for success

## 🛠️ Technical Details

### Built With

* **React 19** - Modern React with hooks
* **TypeScript** - Type-safe development
* **Tailwind CSS** - Utility-first styling
* **Vite** - Fast build tool and dev server
* **Devvit** - Reddit app platform

### Project Structure

```
questiverse/
├── src/
│   ├── client/
│   │   ├── App.tsx          # Main game component
│   │   ├── main.tsx         # Entry point
│   │   ├── index.css        # Global styles
│   │   └── hooks/           # Custom React hooks
│   ├── server/
│   │   ├── index.ts         # Server entry point
│   │   └── core/            # Game logic
│   └── shared/
│       └── types/           # TypeScript definitions
├── dist/                    # Built files
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

### Key Components

* **GameState Management**: Handles navigation between screens
* **Timer System**: Real-time countdown for daily challenges
* **Quest System**: Dynamic riddle generation and verification
* **Responsive Design**: Fits perfectly in any viewport
* **Animated Elements**: Smooth transitions and engaging visuals

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* Devvit CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd questiverse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Upload to Devvit playtest:
```bash
npm run dev:devvit
```

### Available Scripts

* `npm run dev` - Start development server
* `npm run build:client` - Build client for production
* `npm run build:server` - Build server for production
* `npm run dev:devvit` - Upload to Devvit playtest
* `npm run check` - Run type checking and linting

## 🎨 Design Philosophy

### User Experience

* **No Scrolling**: Everything fits within the viewport
* **Intuitive Navigation**: Clear button labels and visual hierarchy
* **Immersive Atmosphere**: Mystical theme with consistent styling
* **Responsive Design**: Works on all screen sizes

### Visual Design

* **Dark Theme**: Easy on the eyes for extended play
* **Golden Accents**: Mystical and treasure-hunt appropriate
* **Smooth Animations**: Engaging but not distracting
* **Clear Typography**: Easy to read in all conditions

## 🏆 Tips for Success

1. **Read Carefully**: Zephyrus's riddles contain important clues
2. **Think Creatively**: Subreddit names can be puns, references, or wordplay
3. **Use Context**: Consider subscriber counts and community themes
4. **Check Rankings**: See how you compare to other hunters
5. **Play Daily**: New challenges appear every day

## 🎲 Example Quests

### Subreddit Quests
* "A place where cats rule supreme, With memes that make you beam. Type the name of this feline domain, Where whiskers and purrs reign!"
  * **Answer**: `r/cats`

### User Quests
* "A name that sounds quite silly, But this user posts quite frilly. Known for viral content galore, Type this Reddit poster name - no more!"
  * **Answer**: `gallowboob`

### Meme Quests
* "A fruit on pizza that causes rage, Dividing Reddit with every page. This controversial topping splits the crowd, Type these two words that make debates loud!"
  * **Answer**: `pineapple pizza`

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines

* Follow TypeScript best practices
* Maintain responsive design principles
* Keep the mystical theme consistent
* Ensure all screens fit within viewport
* Test on multiple screen sizes

## 📝 License

This project is licensed under the BSD-3-Clause License - see the LICENSE file for details.

## 🙏 Acknowledgments

* **Zephyrus**: The mystical Keeper of Secrets who guides all hunters
* **Reddit Community**: For providing the rich ecosystem of subreddits to explore
* **Hunters**: All the brave seekers who participate in the daily challenges

---

**Ready to begin your hunt?** Join Zephyrus and discover the secrets hidden within Reddit's vast landscape! 🧙‍♂️✨

*"The hunt awaits, brave seeker. Will you answer the call?"*
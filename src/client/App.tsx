import { useState, useEffect } from 'react';

type GameState = 'welcome' | 'clue' | 'puzzle' | 'leaderboard' | 'howtoplay' | 'successFlow';

type TimeMessage = 'early' | 'ontime' | 'late' | 'verylate';

interface Quest {
  id: string;
  type: 'subreddit' | 'post' | 'comment' | 'user' | 'topic';
  difficulty: 'easy' | 'medium' | 'hard';
  target: string;
  clue: string;
}

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [timeLeft, setTimeLeft] = useState(23 * 60 + 45); // 23h 45m
  const [timeMessage, setTimeMessage] = useState<TimeMessage>('ontime');
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [questStartTime, setQuestStartTime] = useState<Date | null>(null);
  const [showSuccessFlow, setShowSuccessFlow] = useState(false);
  const [questSolveTime, setQuestSolveTime] = useState<number>(0);
  const [currentUsername, setCurrentUsername] = useState<string>('anonymous');
  const [isLoading, setIsLoading] = useState(false); // Set to false to skip loading
  
  // Quest database - diverse types to keep users guessing
  const quests: Quest[] = [
    // Subreddit quests
    {
      id: 'sub_wholesome',
      type: 'subreddit',
      difficulty: 'medium',
      target: 'r/wholesomememes',
      clue: 'Seek the subreddit where hearts are warm, Where memes bring smiles and chase away harm. With 1.2 million souls, it\'s quite the sight, Find this wholesome place before the night!'
    },
    {
      id: 'sub_gaming',
      type: 'subreddit',
      difficulty: 'easy',
      target: 'r/gaming',
      clue: 'In this realm of pixels and dreams, Where gamers unite in endless streams. With 40 million strong, it\'s quite the sight, Find this gaming kingdom before the night!'
    },
    {
      id: 'sub_programming',
      type: 'subreddit',
      difficulty: 'hard',
      target: 'r/programming',
      clue: 'Where code flows like poetry divine, And developers share their knowledge fine. With 4 million minds, it\'s quite the sight, Find this coding sanctuary before the night!'
    },
    {
      id: 'sub_funny',
      type: 'subreddit',
      difficulty: 'easy',
      target: 'r/funny',
      clue: 'Where laughter echoes through the halls, And humor breaks down all the walls. With 50 million smiles, it\'s quite the sight, Find this comedy kingdom before the night!'
    },
    {
      id: 'sub_science',
      type: 'subreddit',
      difficulty: 'hard',
      target: 'r/science',
      clue: 'Where knowledge meets discovery, And facts reveal life\'s mystery. With 30 million curious minds, it\'s quite the sight, Find this scientific realm before the night!'
    },
    {
      id: 'sub_askreddit',
      type: 'subreddit',
      difficulty: 'medium',
      target: 'r/AskReddit',
      clue: 'Where questions flow like endless streams, And answers spark a thousand dreams. With 40 million curious souls, it\'s quite the sight, Find this question kingdom before the night!'
    },
    {
      id: 'sub_memes',
      type: 'subreddit',
      difficulty: 'easy',
      target: 'r/memes',
      clue: 'Where humor reigns supreme and true, And memes bring joy to me and you. With 30 million laughing hearts, it\'s quite the sight, Find this meme kingdom before the night!'
    },
    {
      id: 'sub_aww',
      type: 'subreddit',
      difficulty: 'easy',
      target: 'r/aww',
      clue: 'Where cuteness overloads the mind, And fluffy friends are hard to find. With 30 million melting hearts, it\'s quite the sight, Find this adorable realm before the night!'
    },
    // Post quests
    {
      id: 'post_cat_piano',
      type: 'post',
      difficulty: 'medium',
      target: 'cat piano',
      clue: 'A tabby cat with musical flair, Playing piano with great care. This video went viral with millions of views, Type these two words that describe the news!'
    },
    {
      id: 'post_ama_bill_gates',
      type: 'post',
      difficulty: 'easy',
      target: 'bill gates',
      clue: 'A billionaire tech giant so grand, Who built an empire across the land. This AMA broke Reddit records that day, Type this Microsoft founder\'s name today!'
    },
    // Comment quests
    {
      id: 'comment_rickroll',
      type: 'comment',
      difficulty: 'easy',
      target: 'rickroll',
      clue: 'Never gonna give you up, never gonna let you down! This classic meme is always around. Type the word that starts this famous song - it\'s what everyone gets wrong!'
    },
    {
      id: 'comment_this',
      type: 'comment',
      difficulty: 'easy',
      target: 'this',
      clue: 'One word that started it all, A simple comment that made Reddit fall. Just three letters that broke the site, Type this legendary word tonight!'
    },
    // User quests
    {
      id: 'user_spez',
      type: 'user',
      difficulty: 'medium',
      target: 'spez',
      clue: 'The leader of this platform we know, Whose name appears when Reddit grows. This CEO\'s username is just four letters, Type this Reddit founder name better!'
    },
    {
      id: 'user_gallowboob',
      type: 'user',
      difficulty: 'easy',
      target: 'gallowboob',
      clue: 'A name that sounds quite silly, But this user posts quite frilly. Known for viral content galore, Type this Reddit poster name - no more!'
    },
    // Topic quests
    {
      id: 'topic_chatgpt',
      type: 'topic',
      difficulty: 'easy',
      target: 'chatgpt',
      clue: 'An AI chatbot that took the world by storm, Helping users in every form. This OpenAI creation changed the game, Type this AI assistant\'s name!'
    },
    {
      id: 'topic_pineapple_pizza',
      type: 'topic',
      difficulty: 'medium',
      target: 'pineapple pizza',
      clue: 'A fruit on pizza that causes rage, Dividing Reddit with every page. This controversial topping splits the crowd, Type these two words that make debates loud!'
    }
  ];

  // Function to get a random quest
  const getRandomQuest = (completedQuestsList: string[] = []) => {
    const availableQuests = quests.filter(quest => !completedQuestsList.includes(quest.id));
    if (availableQuests.length === 0) {
      // If all quests completed, reset and start over
      return quests[Math.floor(Math.random() * quests.length)];
    }
    return availableQuests[Math.floor(Math.random() * availableQuests.length)];
  };

  const [currentHunt, setCurrentHunt] = useState(getRandomQuest());

  // Simple state initialization without localStorage for now
  const [playerStats, setPlayerStats] = useState({
    username: 'anonymous',
    keys: 0,
    score: 0
  });

  const [leaderboard, setLeaderboard] = useState([
    { username: 'anonymous', keys: 0, score: 0, rank: 1 }
  ]);

  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  // Simple username fetch without complex state updates
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/init');
        const data = await response.json();
        if (data.username && data.username !== 'anonymous') {
          setCurrentUsername(data.username);
          setPlayerStats(prev => ({ ...prev, username: data.username }));
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Time-based message effect
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 6) {
      setTimeMessage('early');
    } else if (hour >= 6 && hour < 12) {
      setTimeMessage('ontime');
    } else if (hour >= 12 && hour < 18) {
      setTimeMessage('late');
    } else {
      setTimeMessage('verylate');
    }
  }, []);

  // Simple leaderboard update
  useEffect(() => {
    setLeaderboard(prev => {
      const updated = prev.map(player => 
        player.username === playerStats.username 
          ? { ...player, keys: playerStats.keys, score: playerStats.score }
          : player
      );
      
      // Sort by keys first, then by score
      return updated.sort((a, b) => {
        if (a.keys !== b.keys) return b.keys - a.keys;
        return b.score - a.score;
      }).map((player, index) => ({ ...player, rank: index + 1 }));
    });
  }, [playerStats.keys, playerStats.score, playerStats.username]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTimer = () => (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-3 shadow-2xl border-2 border-red-400 border-opacity-50">
        <div className="text-center">
          <div className="text-4xl mb-1 animate-pulse">⏰</div>
          <div className="text-white font-bold text-xl font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-red-200 text-xs mt-1">Daily Challenge</div>
        </div>
      </div>
    </div>
  );

  const getTimeMessage = () => {
    const username = playerStats.username === 'anonymous' ? 'brave hunter' : `r/${playerStats.username}`;
    switch (timeMessage) {
      case 'early': return `Oh ${username}, you're joining the game early!`;
      case 'ontime': return `Oh ${username}, you're joining the game on time!`;
      case 'late': return `Oh ${username}, you're joining the game late!`;
      case 'verylate': return `Oh ${username}, you're joining the game very late!`;
      default: return `Oh ${username}, you're joining the game!`;
    }
  };

  const handleStartHunt = () => {
    setQuestStartTime(new Date());
    setGameState('clue');
  };

  const handleViewPuzzle = () => {
    setGameState('puzzle');
  };

  const handleViewLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleViewHowToPlay = () => {
    setGameState('howtoplay');
  };

  const handleSubmitAnswer = () => {
    if (!currentHunt) return;
    
    // Simulate answer checking
    setShowResult(true);
    
    // Check answer based on quest type
    let isCorrect = false;
    const userAnswer = answer.toLowerCase().trim();
    const targetAnswer = currentHunt.target.toLowerCase();
    
    if (currentHunt.type === 'subreddit') {
      const correctAnswer = targetAnswer.replace('r/', '');
      // More flexible matching for subreddits
      isCorrect = userAnswer.includes(correctAnswer) || 
                  userAnswer.includes(`r/${correctAnswer}`) ||
                  userAnswer === correctAnswer;
    } else {
      // For other types, check if answer contains key words from target
      const targetWords = targetAnswer.split(' ').filter(word => word.length > 2);
      isCorrect = targetWords.every(word => userAnswer.includes(word)) ||
                  userAnswer.includes(targetAnswer) ||
                  userAnswer === targetAnswer;
    }
    
    if (isCorrect) {
      setResultMessage('🎉 Correct! You found the treasure!');
      
      // Calculate and store the actual solve time
      const timeTaken = questStartTime ? Math.floor((new Date().getTime() - questStartTime.getTime()) / 1000) : 0;
      setQuestSolveTime(timeTaken);
      
      // Mark this quest as completed
      setCompletedQuests(prev => [...prev, currentHunt.id]);
      
      // Update player stats with a key
      setPlayerStats(prev => ({
        ...prev,
        keys: prev.keys + 1,
        score: prev.score + 100
      }));

      // Auto-hide result and show success flow
      setTimeout(() => {
        setShowResult(false);
        setShowSuccessFlow(true);
      }, 2000);
    } else {
      setResultMessage('❌ Not quite right. Keep hunting!');
      // Auto-hide result for misses too
      setTimeout(() => {
        setShowResult(false);
      }, 3000);
    }
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce opacity-20">🗡️</div>
        <div className="absolute top-1/3 right-5 text-3xl animate-pulse opacity-20">💎</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Flipping Clock Timer - Moved to Top */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4 shadow-2xl border-2 border-red-400 border-opacity-50">
            <div className="text-center">
              <div className="text-5xl mb-2 animate-pulse">⏰</div>
              <div className="text-white font-bold text-2xl font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-red-200 text-sm mt-1">Daily Challenge</div>
            </div>
          </div>
        </div>

        {/* Zephyrus - Floating Left - Made Bigger */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-8xl animate-pulse mr-4">🧙‍♂️</div>
          
          {/* Speech bubble */}
          <div className="flex-1 relative max-w-2xl">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl border-2 border-yellow-500 border-opacity-30">
              <div className="absolute -left-4 top-8 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
              
              <div className="text-yellow-400 font-bold mb-2 text-lg">🧙‍♂️ Zephyrus - The Keeper of Secrets</div>
              
              <div className="text-yellow-100 text-sm leading-relaxed mb-3 font-medium">
                {getTimeMessage()}
              </div>
              
              <div className="text-white font-bold text-base mb-2">
                Think you have what it takes to take the lead?
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-2xl mx-auto">
          <button
            onClick={handleStartHunt}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 border-opacity-50"
          >
            <span className="text-sm">⚔️ YES, I'M READY!</span>
          </button>
          <button
            onClick={handleViewHowToPlay}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-400 border-opacity-50"
          >
            <span className="text-sm">📖 HOW TO PLAY</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderClueScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Timer at the top */}
        {renderTimer()}

        {/* Zephyrus - Floating Left */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl animate-pulse mr-4">🧙‍♂️</div>
          
          {/* Compact Clue Speech bubble */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl border-2 border-yellow-500 border-opacity-30">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
              
              <div className="text-yellow-400 font-bold mb-2 text-lg">🔍 The Quest:</div>
              
              <div className="bg-gradient-to-r from-yellow-900 to-amber-900 rounded-xl p-3 mb-2 border border-yellow-600">
                <div className="text-yellow-100 text-sm leading-relaxed font-medium italic">
                  {currentHunt?.clue || 'Loading quest...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-2xl mx-auto">
          <button
            onClick={handleViewPuzzle}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-orange-400 border-opacity-50"
          >
            <span className="text-sm">🔍 I HAVE AN ANSWER</span>
          </button>
          <button
            onClick={handleViewLeaderboard}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-400 border-opacity-50"
          >
            <span className="text-sm">🏆 HALL OF HUNTERS</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPuzzleScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Timer at the top */}
        {renderTimer()}

        {/* Zephyrus - Floating Left */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl animate-pulse mr-4">🧙‍♂️</div>
          
          {/* Puzzle Speech bubble */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl border-2 border-yellow-500 border-opacity-30">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
              
              <div className="text-yellow-100 text-sm leading-relaxed mb-3 font-medium">
                Hmm, you have an answer, let's see.
              </div>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-6 shadow-2xl border-2 border-yellow-500 border-opacity-30 mb-6 w-full max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-yellow-400 font-bold text-lg mb-2">🎯 Your Answer:</div>
            <input
              type="text"
              placeholder={
                currentHunt?.type === 'subreddit' 
                  ? "Enter subreddit name (e.g., wholesomememes)" 
                  : currentHunt?.type === 'user'
                  ? "Enter username (e.g., spez)"
                  : currentHunt?.type === 'comment'
                  ? "Enter the word (e.g., this)"
                  : "Enter your answer..."
              }
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 text-center font-medium"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            />
          </div>
          
          {showResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded-xl text-center">
              <p className="font-bold">{resultMessage}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-2xl mx-auto">
          <button
            onClick={handleSubmitAnswer}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 border-opacity-50"
          >
            <span className="text-sm">⚔️ SUBMIT ANSWER</span>
          </button>
          <button
            onClick={() => setGameState('clue')}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-gray-400 border-opacity-50"
          >
            <span className="text-sm">🔙 BACK TO QUEST</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccessFlowScreen = () => {
    const timeString = questSolveTime < 60 
      ? `${questSolveTime} seconds` 
      : `${Math.floor(questSolveTime / 60)} minutes and ${questSolveTime % 60} seconds`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
          <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
          <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Timer at the top */}
          {renderTimer()}

          {/* Zephyrus - Floating Left */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl animate-pulse mr-4">🧙‍♂️</div>
            
            {/* Success Speech bubble */}
            <div className="flex-1 relative">
              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl border-2 border-yellow-500 border-opacity-30">
                <div className="absolute -left-3 top-6 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
                
                <div className="text-yellow-100 text-sm leading-relaxed mb-3 font-medium">
                  Hmm, you look like a genius! It took you <span className="text-yellow-400 font-bold">{timeString}</span> to solve this quest.
                </div>
                
                <div className="text-white font-bold text-lg mb-2">
                  Here is your key! 🗝️
                </div>
                
                <div className="text-yellow-100 text-sm leading-relaxed mb-3 font-medium">
                  Are you ready to take the next quest?
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-2xl mx-auto mt-4">
            <button
              onClick={() => {
                setShowSuccessFlow(false);
                setQuestStartTime(new Date());
                setAnswer('');
                setQuestSolveTime(0);
                
                // Get a random new quest
                setCurrentHunt(getRandomQuest(completedQuests));
                
                setGameState('clue');
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 border-opacity-50"
            >
              <span className="text-xs">⚔️ NEXT QUEST</span>
            </button>
            <button
              onClick={() => {
                setShowSuccessFlow(false);
                setGameState('leaderboard');
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-400 border-opacity-50"
            >
              <span className="text-xs">🏆 VIEW RANKINGS</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboardScreen = () => {
    const currentPlayer = leaderboard.find(p => p.username === playerStats.username);
    const isTopPlayer = currentPlayer && currentPlayer.rank <= 3;
    
    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Timer at the top */}
          {renderTimer()}

        {/* Zephyrus - Floating Left */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl animate-pulse mr-4">🧙‍♂️</div>
          
          {/* Leaderboard Speech bubble */}
          <div className="flex-1 relative">
              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-6 shadow-2xl border-2 border-yellow-500 border-opacity-30">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
              
                <div className="text-yellow-400 font-bold mb-3 text-xl">🏆 HALL OF FAME</div>
                
                <div className="text-yellow-100 text-sm leading-relaxed mb-4 font-medium">
                  {leaderboard.length === 1 ? (
                    <>
                      Welcome to the realm, brave hunter! You are the first to embark on this quest.
                      <br /><br />
                      <span className="text-yellow-300 font-bold">Your Stats:</span>
                      <br />
                      🗝️ Keys Collected: <span className="text-yellow-400 font-bold">{playerStats.keys}</span>
                      <br />
                      ⭐ Total Score: <span className="text-yellow-400 font-bold">{playerStats.score} points</span>
                      <br />
                      🏆 Current Rank: <span className="text-yellow-400 font-bold">#1 (First Hunter!)</span>
                    </>
                  ) : (
                    <>
                      Behold the greatest treasure hunters of the realm!
                      <br /><br />
                      {leaderboard.slice(0, 3).map((player, index) => (
                        <div key={player.rank} className="mb-2">
                          <span className="text-yellow-300 font-bold">#{player.rank}</span> r/{player.username} - 
                          <span className="text-yellow-400"> {player.keys} keys, {player.score} points</span>
                        </div>
                      ))}
                      {!isTopPlayer && currentPlayer && (
                        <div className="mt-3 pt-2 border-t border-yellow-600">
                          <span className="text-blue-300 font-bold">Your Rank: #{currentPlayer.rank}</span> - 
                          <span className="text-blue-400"> {currentPlayer.keys} keys, {currentPlayer.score} points</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center w-full max-w-2xl mx-auto">
          <button
            onClick={() => setGameState('clue')}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 border-opacity-50"
          >
            <span className="text-sm">⚔️ RETURN TO HUNT</span>
          </button>
        </div>
      </div>
    </div>
  );
  };

  const renderHowToPlayScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">🗝️</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">⚔️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce opacity-20">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-pulse opacity-20">🔍</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Timer at the top */}
        {renderTimer()}

        {/* Zephyrus - Floating Left */}
        <div className="flex items-center justify-center mb-6">
          <div className="text-6xl animate-pulse mr-4">🧙‍♂️</div>
          
          {/* How to Play Speech bubble */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl p-4 shadow-2xl border-2 border-yellow-500 border-opacity-30">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-yellow-500 border-opacity-30"></div>
              
              <div className="text-yellow-400 font-bold mb-2 text-lg">📖 How to Play</div>
              
              <div className="text-yellow-100 text-sm leading-relaxed space-y-2">
                <div>🔍 <strong>Get Your Quest:</strong> Zephyrus will give you a clue to find something on Reddit</div>
                <div>⚔️ <strong>Solve the Puzzle:</strong> Use the clue to find the correct answer</div>
                <div>🗝️ <strong>Earn Keys:</strong> Correct answers earn you keys and points</div>
                <div>🏆 <strong>Climb Rankings:</strong> Compete with other hunters on the leaderboard</div>
                <div>⏰ <strong>Daily Challenge:</strong> New quests appear every day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center w-full max-w-2xl mx-auto">
          <button
            onClick={() => setGameState('welcome')}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 border-opacity-50"
          >
            <span className="text-sm">⚔️ START HUNTING</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-2">
        <div className="text-6xl animate-pulse mb-4">🧙‍♂️</div>
        <div className="text-yellow-400 font-bold text-xl">Loading Questiverse...</div>
        <div className="text-yellow-200 text-sm mt-2">Preparing your adventure...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {showSuccessFlow ? (
        renderSuccessFlowScreen()
      ) : (
        <>
          {gameState === 'welcome' && renderWelcomeScreen()}
          {gameState === 'clue' && renderClueScreen()}
          {gameState === 'puzzle' && renderPuzzleScreen()}
          {gameState === 'leaderboard' && renderLeaderboardScreen()}
          {gameState === 'howtoplay' && renderHowToPlayScreen()}
        </>
      )}
    </div>
  );
};

export default App;
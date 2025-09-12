import { Hunt } from '../../shared/types';

export class HuntGenerator {
  private static instance: HuntGenerator;
  private huntCounter = 0;

  private constructor() {}

  public static getInstance(): HuntGenerator {
    if (!HuntGenerator.instance) {
      HuntGenerator.instance = new HuntGenerator();
    }
    return HuntGenerator.instance;
  }

  public generateDailyHunt(): Hunt {
    this.huntCounter++;
    const huntTypes = [
      this.generateSubscriberCountHunt,
      this.generateUserActivityHunt,
      this.generatePostContentHunt,
      this.generateCrossSubredditHunt
    ];

    const randomType = huntTypes[Math.floor(Math.random() * huntTypes.length)];
    return randomType.call(this);
  }

  private generateSubscriberCountHunt(): Hunt {
    const subscriberCounts = [
      { count: 1234567, subreddit: 'wholesomememes', difficulty: 'medium' as const },
      { count: 2500000, subreddit: 'gaming', difficulty: 'easy' as const },
      { count: 987654, subreddit: 'mildlyinteresting', difficulty: 'hard' as const },
      { count: 1500000, subreddit: 'AskReddit', difficulty: 'easy' as const },
      { count: 750000, subreddit: 'todayilearned', difficulty: 'medium' as const }
    ];

    const target = subscriberCounts[Math.floor(Math.random() * subscriberCounts.length)];
    
    return {
      id: `hunt_${this.huntCounter}`,
      type: 'subscriber_count',
      difficulty: target.difficulty,
      title: 'Subreddit Explorer',
      description: `Find the subreddit with exactly ${target.count.toLocaleString()} subscribers`,
      challenge: `Find the subreddit with exactly ${target.count.toLocaleString()} subscribers`,
      points: target.difficulty === 'easy' ? 100 : target.difficulty === 'medium' ? 250 : 500,
      hints: [
        `The subreddit has between ${Math.floor(target.count * 0.9).toLocaleString()} and ${Math.floor(target.count * 1.1).toLocaleString()} subscribers`,
        'The subreddit name contains common words',
        'It\'s a popular community on Reddit'
      ],
      isActive: true,
      createdAt: new Date()
    };
  }

  private generateUserActivityHunt(): Hunt {
    const activities = [
      { 
        description: 'Find a user who posted in both r/gaming and r/technology today',
        difficulty: 'medium' as const,
        points: 300
      },
      {
        description: 'Find a user with exactly 10,000 karma who posted in r/AskReddit',
        difficulty: 'hard' as const,
        points: 500
      },
      {
        description: 'Find a user who created their account exactly 5 years ago today',
        difficulty: 'easy' as const,
        points: 150
      }
    ];

    const target = activities[Math.floor(Math.random() * activities.length)];

    return {
      id: `hunt_${this.huntCounter}`,
      type: 'user_activity',
      difficulty: target.difficulty,
      title: 'User Detective',
      description: target.description,
      challenge: target.description,
      points: target.points,
      hints: [
        'Check recent posts and comments',
        'Look at user profiles and activity',
        'Use Reddit search features'
      ],
      isActive: true,
      createdAt: new Date()
    };
  }

  private generatePostContentHunt(): Hunt {
    const contentHunts = [
      {
        description: 'Find a post with exactly 1,234 upvotes in r/mildlyinteresting',
        difficulty: 'medium' as const,
        points: 250
      },
      {
        description: 'Find a post containing the word "serendipity" in r/Showerthoughts',
        difficulty: 'hard' as const,
        points: 400
      },
      {
        description: 'Find a post with a cat in r/aww that was posted today',
        difficulty: 'easy' as const,
        points: 100
      }
    ];

    const target = contentHunts[Math.floor(Math.random() * contentHunts.length)];

    return {
      id: `hunt_${this.huntCounter}`,
      type: 'post_content',
      difficulty: target.difficulty,
      title: 'Content Hunter',
      description: target.description,
      challenge: target.description,
      points: target.points,
      hints: [
        'Browse through recent posts',
        'Use search filters and sorting',
        'Check post details and metadata'
      ],
      isActive: true,
      createdAt: new Date()
    };
  }

  private generateCrossSubredditHunt(): Hunt {
    const crossHunts = [
      {
        description: 'Find a user who moderates both r/science and r/technology',
        difficulty: 'hard' as const,
        points: 600
      },
      {
        description: 'Find a post that was cross-posted from r/gaming to r/funny',
        difficulty: 'medium' as const,
        points: 300
      },
      {
        description: 'Find a subreddit that has exactly 3 related subreddits',
        difficulty: 'easy' as const,
        points: 200
      }
    ];

    const target = crossHunts[Math.floor(Math.random() * crossHunts.length)];

    return {
      id: `hunt_${this.huntCounter}`,
      type: 'cross_subreddit',
      difficulty: target.difficulty,
      title: 'Cross-Platform Explorer',
      description: target.description,
      challenge: target.description,
      points: target.points,
      hints: [
        'Explore multiple subreddits',
        'Look for connections between communities',
        'Check moderator lists and related subreddits'
      ],
      isActive: true,
      createdAt: new Date()
    };
  }

  public generateTreasureGodMessage(type: 'welcome' | 'success' | 'failure' | 'hint' | 'encouragement'): string {
    const messages = {
      welcome: [
        'Welcome, brave hunter! I am the Treasure God of Reddit. Your quest begins now! 🏆',
        'Greetings, seeker of keys! The Reddit realm awaits your exploration! 🗝️',
        'Ah, a new hunter approaches! The treasures of Reddit are yours to discover! ✨'
      ],
      success: [
        'Excellent work, hunter! You found the key! The next clue awaits in the depths of Reddit... 🔍✨',
        'Magnificent! Your keen eye has uncovered another treasure! 🏆',
        'Outstanding! The Reddit gods smile upon your success! 🎉'
      ],
      failure: [
        'Hmm, not quite right, brave hunter. Look deeper into the Reddit realm! The answer lies within... 🧐',
        'Close, but not quite! The treasure still eludes you. Try again! 🔍',
        'The path is not yet clear, hunter. Seek further in the Reddit maze! 🗺️'
      ],
      hint: [
        'Your next quest: Find a user who posted in both r/gaming and r/technology today! 🤝',
        'The treasure lies in a subreddit with exactly 1,234,567 subscribers! 🔢',
        'Look for a post with exactly 1,234 upvotes in r/mildlyinteresting! 📊'
      ],
      encouragement: [
        'Keep hunting, brave soul! Every key brings you closer to the ultimate treasure! 💪',
        'The Reddit realm is vast, but your determination is stronger! 🌟',
        'Each hunt makes you wiser, each key makes you mightier! ⚔️'
      ]
    };

    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
}


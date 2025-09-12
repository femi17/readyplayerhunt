import { Hunt } from '../../shared/types';

export class VerificationService {
  private static instance: VerificationService;

  private constructor() {}

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  public async verifySolution(hunt: Hunt, solution: string): Promise<{ isValid: boolean; message: string; points: number }> {
    try {
      switch (hunt.type) {
        case 'subscriber_count':
          return this.verifySubscriberCount(hunt, solution);
        case 'user_activity':
          return this.verifyUserActivity(hunt, solution);
        case 'post_content':
          return this.verifyPostContent(hunt, solution);
        case 'cross_subreddit':
          return this.verifyCrossSubreddit(hunt, solution);
        default:
          return { isValid: false, message: 'Unknown hunt type', points: 0 };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { isValid: false, message: 'Verification failed', points: 0 };
    }
  }

  private async verifySubscriberCount(hunt: Hunt, solution: string): Promise<{ isValid: boolean; message: string; points: number }> {
    // Extract subscriber count from hunt description
    const countMatch = hunt.description.match(/(\d{1,3}(?:,\d{3})*)/);
    if (!countMatch) {
      return { isValid: false, message: 'Invalid hunt format', points: 0 };
    }

    const targetCount = parseInt(countMatch[1].replace(/,/g, ''));
    
    // Mock verification - in real implementation, this would call Reddit API
    const mockSubredditData = {
      'wholesomememes': 1234567,
      'gaming': 2500000,
      'mildlyinteresting': 987654,
      'AskReddit': 1500000,
      'todayilearned': 750000
    };

    const subredditName = solution.toLowerCase().replace(/^r\//, '');
    const actualCount = mockSubredditData[subredditName as keyof typeof mockSubredditData];

    if (actualCount === targetCount) {
      return {
        isValid: true,
        message: `✅ SUCCESS! Explorer key unlocked! 🗝️ Found r/${subredditName} with ${actualCount.toLocaleString()} subscribers!`,
        points: hunt.points
      };
    } else {
      return {
        isValid: false,
        message: `❌ Not quite right. r/${subredditName} has ${actualCount?.toLocaleString() || 'unknown'} subscribers, not ${targetCount.toLocaleString()}. Keep hunting! 🔍`,
        points: 0
      };
    }
  }

  private async verifyUserActivity(hunt: Hunt, solution: string): Promise<{ isValid: boolean; message: string; points: number }> {
    // Mock verification for user activity
    const mockUsers = [
      'TechGamer123',
      'ScienceModerator',
      'RedditVeteran',
      'CrossPoster',
      'MultiSubUser'
    ];

    const isValid = mockUsers.some(user => 
      solution.toLowerCase().includes(user.toLowerCase())
    );

    if (isValid) {
      return {
        isValid: true,
        message: `✅ SUCCESS! Collaborator key unlocked! 🤝 Found the active user!`,
        points: hunt.points
      };
    } else {
      return {
        isValid: false,
        message: `❌ Not quite right. Keep searching for active users! 🔍`,
        points: 0
      };
    }
  }

  private async verifyPostContent(hunt: Hunt, solution: string): Promise<{ isValid: boolean; message: string; points: number }> {
    // Mock verification for post content
    const mockPosts = [
      '1234 upvotes',
      'serendipity',
      'cat picture',
      'mildly interesting fact',
      'shower thought'
    ];

    const isValid = mockPosts.some(post => 
      solution.toLowerCase().includes(post.toLowerCase())
    );

    if (isValid) {
      return {
        isValid: true,
        message: `✅ SUCCESS! Creator key unlocked! 🎨 Found the perfect post!`,
        points: hunt.points
      };
    } else {
      return {
        isValid: false,
        message: `❌ Not quite right. Keep hunting for the right content! 🔍`,
        points: 0
      };
    }
  }

  private async verifyCrossSubreddit(hunt: Hunt, solution: string): Promise<{ isValid: boolean; message: string; points: number }> {
    // Mock verification for cross-subreddit activities
    const mockCrossActivities = [
      'moderator',
      'cross-post',
      'related subreddit',
      'community connection',
      'multi-subreddit'
    ];

    const isValid = mockCrossActivities.some(activity => 
      solution.toLowerCase().includes(activity.toLowerCase())
    );

    if (isValid) {
      return {
        isValid: true,
        message: `✅ SUCCESS! Cross-platform key unlocked! 🌐 Found the connection!`,
        points: hunt.points
      };
    } else {
      return {
        isValid: false,
        message: `❌ Not quite right. Look for connections between subreddits! 🔍`,
        points: 0
      };
    }
  }

  public getKeyType(hunt: Hunt): 'explorer' | 'collaborator' | 'creator' {
    switch (hunt.type) {
      case 'subscriber_count':
        return 'explorer';
      case 'user_activity':
        return 'collaborator';
      case 'post_content':
      case 'cross_subreddit':
        return 'creator';
      default:
        return 'explorer';
    }
  }
}


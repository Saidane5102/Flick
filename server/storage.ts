import { users, cards, designs, comments, badges, userBadges } from "@shared/schema";
import type { User, InsertUser, Card, InsertCard, Design, InsertDesign, Comment, InsertComment, Badge, UserBadge } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  addPoints(userId: number, points: number): Promise<User | undefined>;
  updateLevel(userId: number): Promise<User | undefined>;
  
  // Card methods
  getCards(): Promise<Card[]>;
  getCardsByCategory(category: string): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
  
  // Design methods
  getDesigns(): Promise<Design[]>;
  getDesignsByUser(userId: number): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, design: Partial<InsertDesign>): Promise<Design | undefined>;
  deleteDesign(id: number): Promise<boolean>;
  likeDesign(id: number): Promise<Design | undefined>;
  
  // Comment methods
  getCommentsByDesign(designId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Badge methods
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<{ badge: Badge, userBadge: UserBadge }[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge | undefined>;
  
  // User stats
  getUserStats(userId: number): Promise<{
    completedChallenges: number;
    earnedBadges: number;
    totalLikes: number;
    points: number;
    level: number;
    progressToNextLevel: number;
    nextLevelPoints: number;
  }>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private designs: Map<number, Design>;
  private comments: Map<number, Comment>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  currentUserId: number;
  currentCardId: number;
  currentDesignId: number;
  currentCommentId: number;
  currentBadgeId: number;
  currentUserBadgeId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.designs = new Map();
    this.comments = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.currentUserId = 1;
    this.currentCardId = 1;
    this.currentDesignId = 1;
    this.currentCommentId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample cards
    this.initSampleData();
  }
  
  private initSampleData() {
    // Sample cards for each category
    const sampleCards = [
      // Client cards
      { category: "Client", promptText: "Local coffee shop", backContent: "Consider the community-focused nature of local coffee shops and how to create a cozy, inviting aesthetic.", difficulty: "Beginner" },
      { category: "Client", promptText: "Tech startup", backContent: "Tech startups often want to convey innovation and disruption. Consider modern, forward-thinking design elements.", difficulty: "Intermediate" },
      { category: "Client", promptText: "Luxury fashion brand", backContent: "Luxury brands value exclusivity and sophistication. Consider elegant typography and minimalist design.", difficulty: "Advanced" },
      
      // Need cards
      { category: "Need", promptText: "Logo design", backContent: "A memorable logo communicates brand values at a glance. Consider scalability and versatility across print and digital formats.", difficulty: "Beginner" },
      { category: "Need", promptText: "Poster for an event", backContent: "Event posters need to communicate key information clearly while capturing attention. Focus on hierarchy and readability.", difficulty: "Intermediate" },
      { category: "Need", promptText: "Website landing page", backContent: "Landing pages need to convert visitors to actions. Focus on clear CTAs and compelling visuals.", difficulty: "Intermediate" },
      
      // Challenge cards
      { category: "Challenge", promptText: "Limited color palette (2 colors only)", backContent: "Working with a limited palette can create striking, memorable designs. Consider complementary or monochromatic schemes for visual impact.", difficulty: "Beginner" },
      { category: "Challenge", promptText: "Typography-focused design", backContent: "When focusing on typography, consider font pairing, hierarchy, and how type can create visual interest without relying on images.", difficulty: "Intermediate" },
      { category: "Challenge", promptText: "No stock images", backContent: "Instead of stock photography, explore illustrations, custom photography, or creative typography solutions.", difficulty: "Advanced" },
      
      // Audience cards
      { category: "Audience", promptText: "Gen Z trendsetters", backContent: "Gen Z appreciates authenticity, bold aesthetics, and designs that feel current but not trying too hard. Consider vibrant colors and playful elements.", difficulty: "Intermediate" },
      { category: "Audience", promptText: "Eco-conscious consumers", backContent: "This audience prioritizes sustainability and ethical practices. Designs that feature natural elements, earthy tones, and minimal waste aesthetics typically resonate.", difficulty: "Beginner" },
      { category: "Audience", promptText: "Busy professionals", backContent: "Time-constrained professionals value clarity and efficiency. Consider clean layouts with clear hierarchy and minimal distractions.", difficulty: "Intermediate" }
    ];
    
    // Add sample cards
    sampleCards.forEach(card => {
      this.createCard(card);
    });
    
    // Initialize badges
    const sampleBadges = [
      { name: "Starting Strong", description: "Completed 5 challenges", icon: "lightbulb", requirement: "challenges", requiredCount: 5 },
      { name: "Color Theory Pro", description: "3 color challenges", icon: "palette", requirement: "color_challenges", requiredCount: 3 },
      { name: "Logo Legend", description: "Created 3 logos", icon: "pen-tool", requirement: "logo_designs", requiredCount: 3 },
      { name: "Community Builder", description: "10+ comments given", icon: "message-circle", requirement: "comments", requiredCount: 10 },
      { name: "Challenge Master", description: "Complete 15 challenges", icon: "award", requirement: "challenges", requiredCount: 15 },
      { name: "Visual Virtuoso", description: "Get 50+ upvotes on a design", icon: "star", requirement: "likes", requiredCount: 50 }
    ];
    
    sampleBadges.forEach(badge => {
      const id = this.currentBadgeId++;
      const newBadge: Badge = { id, ...badge };
      this.badges.set(id, newBadge);
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0,
      level: 1,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userUpdate
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async addPoints(userId: number, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      points: user.points + points
    };
    
    this.users.set(userId, updatedUser);
    
    // Check if user should level up
    this.updateLevel(userId);
    
    return updatedUser;
  }
  
  async updateLevel(userId: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Calculate level based on points
    // Formula: level = 1 + floor(sqrt(points / 25))
    // This creates a curve where each level requires more points
    const newLevel = 1 + Math.floor(Math.sqrt(user.points / 25));
    
    if (newLevel > user.level) {
      const updatedUser: User = {
        ...user,
        level: newLevel
      };
      
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    
    return user;
  }
  
  // Card methods
  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }
  
  async getCardsByCategory(category: string): Promise<Card[]> {
    return Array.from(this.cards.values()).filter(
      card => card.category === category
    );
  }
  
  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }
  
  async createCard(card: InsertCard): Promise<Card> {
    const id = this.currentCardId++;
    const now = new Date();
    const newCard: Card = {
      ...card,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cards.set(id, newCard);
    return newCard;
  }
  
  async updateCard(id: number, cardUpdate: Partial<InsertCard>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard: Card = {
      ...card,
      ...cardUpdate,
      updatedAt: new Date()
    };
    
    this.cards.set(id, updatedCard);
    return updatedCard;
  }
  
  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }
  
  // Design methods
  async getDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values());
  }
  
  async getDesignsByUser(userId: number): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(
      design => design.userId === userId
    );
  }
  
  async getDesign(id: number): Promise<Design | undefined> {
    return this.designs.get(id);
  }
  
  async createDesign(design: InsertDesign): Promise<Design> {
    const id = this.currentDesignId++;
    const now = new Date();
    const newDesign: Design = {
      ...design,
      id,
      likes: 0,
      createdAt: now
    };
    this.designs.set(id, newDesign);
    return newDesign;
  }
  
  async updateDesign(id: number, designUpdate: Partial<InsertDesign>): Promise<Design | undefined> {
    const design = this.designs.get(id);
    if (!design) return undefined;
    
    const updatedDesign: Design = {
      ...design,
      ...designUpdate
    };
    
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }
  
  async deleteDesign(id: number): Promise<boolean> {
    return this.designs.delete(id);
  }
  
  async likeDesign(id: number): Promise<Design | undefined> {
    const design = this.designs.get(id);
    if (!design) return undefined;
    
    const updatedDesign: Design = {
      ...design,
      likes: design.likes + 1
    };
    
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }
  
  // Comment methods
  async getCommentsByDesign(designId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.designId === designId
    );
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const now = new Date();
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: now
    };
    this.comments.set(id, newComment);
    return newComment;
  }
  
  // Badge methods
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getUserBadges(userId: number): Promise<{ badge: Badge, userBadge: UserBadge }[]> {
    const userBadgeEntries = Array.from(this.userBadges.values()).filter(
      userBadge => userBadge.userId === userId
    );
    
    return userBadgeEntries.map(userBadge => {
      const badge = this.badges.get(userBadge.badgeId)!;
      return { badge, userBadge };
    });
  }
  
  async awardBadge(userId: number, badgeId: number): Promise<UserBadge | undefined> {
    // Check if user already has this badge
    const existingBadge = Array.from(this.userBadges.values()).find(
      ub => ub.userId === userId && ub.badgeId === badgeId
    );
    
    if (existingBadge) return existingBadge;
    
    // Check if badge exists
    const badge = await this.badges.get(badgeId);
    if (!badge) return undefined;
    
    // Award new badge
    const id = this.currentUserBadgeId++;
    const now = new Date();
    const userBadge: UserBadge = {
      id,
      userId,
      badgeId,
      earnedAt: now
    };
    
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
  
  // User stats
  async getUserStats(userId: number): Promise<{
    completedChallenges: number;
    earnedBadges: number;
    totalLikes: number;
    points: number;
    level: number;
    nextLevelPoints: number;
    progressToNextLevel: number;
  }> {
    const userDesigns = await this.getDesignsByUser(userId);
    const userBadges = await this.getUserBadges(userId);
    const totalLikes = userDesigns.reduce((sum, design) => sum + design.likes, 0);
    const user = await this.getUser(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Calculate points needed for next level
    // Formula is: points for level N = 25 * (N - 1)^2
    const pointsForCurrentLevel = 25 * Math.pow(user.level - 1, 2);
    const pointsForNextLevel = 25 * Math.pow(user.level, 2);
    const pointsNeededForNextLevel = pointsForNextLevel - pointsForCurrentLevel;
    const currentLevelProgress = user.points - pointsForCurrentLevel;
    
    // Calculate progress percentage
    const progressPercentage = Math.min(100, Math.floor((currentLevelProgress / pointsNeededForNextLevel) * 100));
    
    return {
      completedChallenges: userDesigns.length,
      earnedBadges: userBadges.length,
      totalLikes,
      points: user.points,
      level: user.level,
      nextLevelPoints: pointsNeededForNextLevel,
      progressToNextLevel: progressPercentage
    };
  }
}

export const storage = new MemStorage();

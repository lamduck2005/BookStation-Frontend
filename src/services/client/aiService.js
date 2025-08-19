const GOOGLE_AI_API_KEY= 'AIzaSyAanHTvKFs5KvolI7iOTkzn52crAjUpRQA'
import { GoogleGenerativeAI } from '@google/generative-ai';


class AIService {
  constructor() {
    const apiKey = GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key không được tìm thấy');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite' 
    });
    
    // Simple rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests
  }

  // Simple rate limiting
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Generate summary
  async generateSummary(content) {
    try {
      // Wait for rate limit
      await this.waitForRateLimit();
      
      const prompt = `${content}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Lỗi khi tạo tóm tắt:', error);
      throw error;
    }
  }
}

export default new AIService();
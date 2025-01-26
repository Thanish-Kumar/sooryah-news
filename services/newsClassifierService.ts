import OpenAI from 'openai';

export class NewsClassifierService {
  private openai: OpenAI;
  
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async isHealthRelated(title: string, summary: string = "") {
    const prompt = `
      Title: ${title}
      Summary: ${summary}

      Task: Classify if this news article is related to health, healthcare, medicine, 
      medical science, or public health. Respond with only "true" or "false".
      
      Classification:
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a precise news classifier. Respond only with 'true' or 'false'." },
          { role: "user", content: prompt }
        ],
        temperature: 0,
        max_tokens: 10
      });

      const result = response.choices[0].message.content?.trim().toLowerCase();
      
      return {
        is_health_related: result === "true",
        confidence: 1.0
      };
    } catch (error) {
      console.error(`OpenAI API error: ${error}`);
      return this.keywordFallback(title);
    }
  }

  private keywordFallback(title: string) {
    const healthKeywords = new Set([
      'health', 'healthcare', 'medical', 'medicine', 'hospital', 'doctor',
      'disease', 'virus', 'pandemic', 'epidemic', 'vaccine', 'drug',
      'pharma', 'clinical', 'treatment', 'patient', 'surgery', 'research',
      'WHO', 'AIIMS', 'public health', 'wellness', 'diagnosis', 'therapy',
      'cancer', 'covid', 'infection'
    ]);

    const isHealth = Array.from(healthKeywords).some(
      keyword => title.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      is_health_related: isHealth,
      confidence: isHealth ? 0.7 : 0.3
    };
  }
} 
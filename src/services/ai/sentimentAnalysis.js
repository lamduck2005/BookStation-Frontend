const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Phân tích sentiment của một đánh giá bằng Groq AI
 * @param {string} reviewText - Nội dung đánh giá
 * @param {number} rating - Số sao đánh giá (1-5)
 * @returns {Promise<{isPositive: boolean, sentiment: string, confidence: number}>}
 */
export async function analyzeSentiment(reviewText, rating) {
  try {
    // Prompt để phân tích sentiment
    const prompt = `
Hãy phân tích đánh giá sau và cho biết nó có tích cực hay không:

Đánh giá: "${reviewText}"
Số sao: ${rating}/5

Quy tắc:
- Chỉ được coi là TÍCH CỰC khi:
  1. Số sao >= 4 (4 hoặc 5 sao)
  2. Nội dung đánh giá thể hiện sự hài lòng, khen ngợi, hoặc trung tính tích cực
- Nếu số sao < 4 hoặc nội dung tiêu cực → TIÊU CỰC

Trả về JSON với format chính xác:
{
  "isPositive": true/false,
  "sentiment": "positive"/"negative", 
  "confidence": 0.0-1.0,
  "reason": "Lý do ngắn gọn"
}
`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse JSON response từ AI
    let analysisResult;
    try {
      // Tìm JSON trong response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response as JSON:", aiResponse);
      // Fallback analysis based on rating and keywords
      analysisResult = fallbackAnalysis(reviewText, rating);
    }

    // Validate và ensure có đầy đủ fields
    return {
      isPositive: Boolean(analysisResult.isPositive),
      sentiment: analysisResult.sentiment || (analysisResult.isPositive ? "positive" : "negative"),
      confidence: Number(analysisResult.confidence) || 0.8,
      reason: analysisResult.reason || "Phân tích tự động",
      aiResponse: aiResponse
    };

  } catch (error) {
    console.error("Sentiment analysis error:", error);
    // Fallback to rule-based analysis
    return fallbackAnalysis(reviewText, rating);
  }
}

/**
 * Phân tích fallback dựa trên rules đơn giản
 */
function fallbackAnalysis(reviewText, rating) {
  const text = reviewText.toLowerCase();
  
  // Từ khóa tiêu cực
  const negativeKeywords = ['tệ', 'kém', 'dở', 'không tốt', 'thất vọng', 'tồi', 'chậm', 'lỗi', 'hỏng', 'không hài lòng'];
  const hasNegativeKeywords = negativeKeywords.some(keyword => text.includes(keyword));
  
  // Từ khóa tích cực  
  const positiveKeywords = ['tốt', 'hay', 'tuyệt', 'ổn', 'hài lòng', 'chất lượng', 'nhanh', 'đẹp', 'thích'];
  const hasPositiveKeywords = positiveKeywords.some(keyword => text.includes(keyword));
  
  // Logic phân tích
  let isPositive = false;
  let confidence = 0.7;
  let reason = "";
  
  if (rating >= 4) {
    if (hasNegativeKeywords) {
      isPositive = false;
      reason = `${rating} sao nhưng có từ khóa tiêu cực`;
      confidence = 0.8;
    } else {
      isPositive = true;
      reason = `${rating} sao và không có từ khóa tiêu cực`;
      confidence = hasPositiveKeywords ? 0.9 : 0.7;
    }
  } else {
    isPositive = false;
    reason = `Chỉ ${rating} sao - dưới ngưỡng tích cực`;
    confidence = 0.9;
  }
  
  return {
    isPositive,
    sentiment: isPositive ? "positive" : "negative",
    confidence,
    reason
  };
}

/**
 * Validate đánh giá có được chấp nhận hay không
 */
export function validateReview(reviewText, rating, sentimentAnalysis) {
  const errors = [];
  
  // Check rating
  if (rating < 4) {
    errors.push("Đánh giá phải từ 4 sao trở lên");
  }
  
  // Check text length
  if (!reviewText || reviewText.trim().length < 10) {
    errors.push("Nội dung đánh giá phải có ít nhất 10 ký tự");
  }
  
  // Check sentiment
  if (!sentimentAnalysis.isPositive) {
    errors.push("Nội dung đánh giá không đủ tích cực");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    canSubmit: errors.length === 0
  };
}

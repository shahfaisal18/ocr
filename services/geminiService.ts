import { GoogleGenAI, Type } from "@google/genai";
import { StockData, Direction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = 'gemini-2.5-flash';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        symbol: {
            type: Type.STRING,
            description: 'The stock ticker symbol, e.g., AAPL, GOOG.',
        },
        price: {
            type: Type.NUMBER,
            description: 'The current price of the stock.',
        },
        direction: {
            type: Type.STRING,
            enum: [Direction.UP, Direction.DOWN, Direction.FLAT],
            description: 'The price trend direction: up, down, or flat.',
        },
    },
    required: ['symbol', 'price', 'direction'],
};

/**
 * Extracts stock data by analyzing the image name.
 * This completely avoids API errors by not sending any image data.
 */
export const extractStockDataFromName = async (imageName: string): Promise<StockData> => {
    const prompt = `You are an OCR model for a financial app. Analyze the provided filename.
        The filename is: "${imageName}".
        The filename format is SYMBOL_DIRECTION_PRICE.
        From this filename, extract the stock symbol, its price, and its direction ('up', 'down', or 'flat').
        Rely entirely on the filename to generate the JSON response.
        For example, for a file named "AAPL_UP_182.50", the symbol is "AAPL", direction is "up", and price is 182.50.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
        throw new Error("Empty response from Gemini API");
    }

    try {
        const extractedData = JSON.parse(jsonString);

        // Add a timestamp to the extracted data.
        return {
            ...extractedData,
            timestamp: new Date().toISOString(),
        };
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("Invalid JSON response from Gemini API");
    }
};
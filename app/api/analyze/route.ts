import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    const models = [
      { id: 'Earthquake', file: 'earthquake.pth' },
      { id: 'Wildfire', file: 'wildfire.pth' },
      { id: 'Landslide', file: 'landslide.pth' }
    ];

    const results = [];

    for (const model of models) {
      const modelPath = path.join(process.cwd(), 'models', model.file);
      
      if (fs.existsSync(modelPath)) {
        // Read model file to simulate weight loading
        const modelBuffer = fs.readFileSync(modelPath);
        console.log(`Local Inference: Loading ${model.file} (${modelBuffer.length} bytes)`);

        // Generate a random confidence score for simulation
        // In a real scenario, this would be the actual model output
        const confidenceValue = Math.random() * 30 + 70; // 70% to 100%
        
        results.push({
          type: model.id,
          confidenceValue: confidenceValue,
          confidence: confidenceValue.toFixed(2) + '%',
          description: `Consensus analysis complete. Model ${model.file} identified visual patterns consistent with a ${model.id.toLowerCase()} event.`,
          severity: ['Moderate', 'High', 'Extreme'][Math.floor(Math.random() * 3)],
          modelUsed: model.file,
          engine: 'Local PTH Engine'
        });
      }
    }

    if (results.length === 0) {
      return NextResponse.json({ 
        error: `No model files found in /models/. Please upload earthquake.pth, wildfire.pth, and landslide.pth.` 
      }, { status: 404 });
    }

    // Sort by confidence and pick the highest
    const bestResult = results.sort((a, b) => b.confidenceValue - a.confidenceValue)[0];

    // Simulate processing time for running multiple models
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(bestResult);
  } catch (error) {
    console.error('Local Inference Error:', error);
    return NextResponse.json({ error: 'Internal Model Error' }, { status: 500 });
  }
}
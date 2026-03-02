#!/usr/bin/env node

/**
 * Kinetic Demo Agent
 * 
 * This script demonstrates a realistic AI agent that sometimes gets stuck in loops.
 * It generates test data for the Kinetic dashboard to showcase the monitoring capabilities.
 * 
 * Run with: node demo-agent.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';
const AGENT_ID = `demo-agent-${Date.now()}`;

const scenarios = [
  {
    name: 'healthy_agent',
    description: 'Agent working normally, diverse responses',
    generateResponse: (iteration) => {
      const topics = [
        `Analyzing user request #${iteration}: Find the capital of France`,
        `Searching database for geographical information about European countries`,
        `Retrieved: Paris is the capital of France, located on the Seine River`,
        `User query resolved successfully. Paris is the capital and largest city of France.`,
      ];
      return topics[iteration % topics.length] || topics[0];
    },
    tokensPerResponse: () => Math.floor(Math.random() * 100) + 50,
  },
  {
    name: 'loop_agent',
    description: 'Agent stuck in retry loop',
    generateResponse: (iteration) => {
      const loopResponses = [
        'Retrying API call due to timeout error',
        'Retrying API call due to timeout error',
        'Retrying API call due to timeout error',
        'Retrying API call due to timeout error',
      ];
      return loopResponses[iteration % loopResponses.length];
    },
    tokensPerResponse: () => 12 + Math.floor(Math.random() * 5), // Very consistent token counts
  },
  {
    name: 'recursive_agent',
    description: 'Agent recursively searching same space',
    generateResponse: (iteration) => {
      return `Searching for solution attempt #${iteration}: recursively calling search_inventory() -> search_products() -> search_inventory()`;
    },
    tokensPerResponse: () => 25 + Math.floor(Math.random() * 8),
  },
  {
    name: 'token_waste_agent',
    description: 'Agent slowly increasing token usage (hallucinating)',
    generateResponse: (iteration) => {
      const base = 'Generating response with increasing verbosity. ' + 'additional content '.repeat(iteration);
      return base.substring(0, 200 + iteration * 10);
    },
    tokensPerResponse: () => 100 + (Math.floor(Math.random() * 50) * 2),
  },
];

/**
 * Run a scenario for a period of time
 */
async function runScenario(scenario, durationSeconds = 30) {
  console.log(`\n[DEMO] Starting: ${scenario.name}`);
  console.log(`[DEMO] Description: ${scenario.description}`);

  const startTime = Date.now();
  const responses = [];
  const tokens = [];
  let iteration = 0;

  while (Date.now() - startTime < durationSeconds * 1000) {
    iteration++;
    const response = scenario.generateResponse(iteration);
    const tokenCount = scenario.tokensPerResponse();

    responses.push(response);
    tokens.push(tokenCount);

    try {
      const entropyResult = await calculateEntropy(responses, tokens);
      
      // Log to console with color coding
      const entropy = entropyResult.entropy.toFixed(2);
      const loopStatus = entropyResult.loopDetected ? '🚨 LOOP DETECTED' : '✓ Normal';
      const similarity = (entropyResult.similarity * 100).toFixed(1);

      console.log(
        `  [${iteration}] Entropy: ${entropy}% | Similarity: ${similarity}% | Tokens: ${tokenCount} | ${loopStatus}`
      );

      // Wait 2 seconds between iterations
      await sleep(2000);
    } catch (error) {
      console.error(`[ERROR] Failed to calculate entropy:`, error.message);
      await sleep(2000);
    }
  }

  console.log(`[DEMO] Completed: ${scenario.name} (${iteration} iterations)\n`);
}

/**
 * Calculate entropy by calling the backend API
 */
async function calculateEntropy(responses, tokens) {
  try {
    const response = await fetch(`${API_URL}/api/v1/calculate-entropy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        responses,
        tokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to reach ${API_URL}: ${error.message}`);
  }
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log('========================================');
  console.log('  Kinetic Integrity Monitor - Demo');
  console.log('========================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Agent ID: ${AGENT_ID}`);
  console.log('');
  console.log('This demo will run 4 scenarios, each showing different agent patterns.');
  console.log('Watch the entropy values change as agents exhibit healthy vs. problematic behavior.\n');

  // Check if API is reachable
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    console.log('✓ Backend API is reachable\n');
  } catch (error) {
    console.error('✗ Cannot reach backend API at', API_URL);
    console.error('  Make sure the server is running:');
    console.error('    cd server && npm run dev');
    process.exit(1);
  }

  // Run each scenario
  for (const scenario of scenarios) {
    await runScenario(scenario, 20); // 20 seconds per scenario
    await sleep(2000);
  }

  console.log('\n========================================');
  console.log('  Demo Complete!');
  console.log('========================================');
  console.log('\nCheck the dashboard at http://localhost:3000');
  console.log('You should see entropy values and loop detection patterns.\n');
}

main().catch(error => {
  console.error('[FATAL]', error);
  process.exit(1);
});

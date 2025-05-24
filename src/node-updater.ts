import { Client } from '@hiveio/dhive';
import { FlowerEngineMetadata, NodeUpdateResult, NodeReport } from './types';
// dhive client to interact with the Hive blockchain
// You can use a public Hive RPC node or your own node
const hiveClient = new Client(['https://api.hive.blog', 'https://api.deathwing.me']);

/**
 * Fetches the JSON metadata from a given Hive account.
 * @param accountName The name of the Hive account (e.g., "flowerengine").
 * @returns A Promise that resolves with the parsed JSON metadata.
 * @throws An error if the account metadata cannot be fetched or parsed.
 */
async function getAccountMetadata(accountName: string): Promise<FlowerEngineMetadata> {
  try {
    const [account] = await hiveClient.database.getAccounts([accountName]);

    if (!account) {
      throw new Error(`Account @${accountName} not found.`);
    }

    if (!account.json_metadata) {
      throw new Error(`Account @${accountName} has no JSON metadata.`);
    }

    const metadata: FlowerEngineMetadata = JSON.parse(account.json_metadata);

    // Basic validation to ensure the structure matches our interface
    if (!metadata.nodes || !Array.isArray(metadata.nodes) || !metadata.failing_nodes || typeof metadata.failing_nodes !== 'object') {
        throw new Error("Invalid FlowerEngine metadata structure. Missing 'nodes' or 'failing_nodes'.");
    }

    return metadata;
  } catch (error: any) {
    console.error(`Error fetching or parsing metadata for @${accountName}:`, error.message);
    throw new Error(`Failed to fetch FlowerEngine metadata: ${error.message}`);
  }
}

/**
 * Updates and retrieves the list of Hive-Engine nodes from the FlowerEngine account's JSON metadata.
 * Prioritizes active nodes and provides detailed information on failing ones.
 * @param accountName The Hive account name where the node list is stored (default: "flowerengine").
 * @returns A Promise that resolves with an object containing active and failing nodes.
 */
export async function updateNodesFromAccount(accountName: string = "flowerengine"): Promise<NodeUpdateResult> {
  try {
    const metadata = await getAccountMetadata(accountName);

    const nodes = metadata.nodes;
    const failing_nodes = metadata.failing_nodes;

    console.log("Node update complete. Active Nodes:");
    nodes.forEach((node, idx) => console.log(`${idx + 1}. ${node}`));

    if (Object.keys(failing_nodes).length > 0) {
      console.log("Failing nodes:");
      Object.entries(failing_nodes).forEach(([node, reason]) => {
        console.log(`- ${node}: ${reason}`);
      });
    }

    return { nodes, failing_nodes, fullMetadata: metadata };
  } catch (error: any) {
    console.error("Error during node update:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
}

/**
 * Fetches the full report of nodes, including performance metrics.
 * @param accountName The Hive account name where the node list is stored (default: "flowerengine").
 * @returns A Promise that resolves with an array of NodeReport objects.
 */
export async function getFullNodeReport(accountName: string = "flowerengine"): Promise<NodeReport[]> {
    try {
        const metadata = await getAccountMetadata(accountName);
        return metadata.report || []; // Return empty array if report is missing
    } catch (error: any) {
        console.error("Error fetching full node report:", error.message);
        throw error;
    }
}

/**
 * Selects the best performing node based on weighted_score from the report.
 * @param accountName The Hive account name where the node list is stored (default: "flowerengine").
 * @returns A Promise that resolves with the URL of the best node, or null if none found.
 */
export async function getBestNode(accountName: string = "flowerengine"): Promise<string | null> {
    try {
        const report = await getFullNodeReport(accountName);
        if (report.length === 0) {
            console.warn("No node reports available to determine the best node.");
            return null;
        }

        // Filter out nodes that are not "engine: true" and sort by weighted_score descending
        const activeAndEngineNodes = report.filter(node => node.engine === true);

        if (activeAndEngineNodes.length === 0) {
            console.warn("No active Hive-Engine nodes found in the report.");
            return null;
        }

        activeAndEngineNodes.sort((a, b) => b.weighted_score - a.weighted_score);

        return activeAndEngineNodes[0].node;
    } catch (error: any) {
        console.error("Error getting best node:", error.message);
        throw error;
    }
}
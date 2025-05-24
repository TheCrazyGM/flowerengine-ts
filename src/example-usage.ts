import { updateNodesFromAccount, getBestNode } from './node-updater';
import fetch from 'node-fetch';
import { NodeUpdateResult } from './types';

/**
 * Interfaz para la información de un token devuelta por la API de Hive-Engine.
 */
interface TokenInfo {
  _id: number;
  issuer: string;
  symbol: string;
  name: string;
  metadata: string;
  precision: number;
  maxSupply: string;
  supply: string;
  circulatingSupply: string;
  stakingEnabled: boolean;
  unstakingCooldown: number;
  delegationEnabled: boolean;
  undelegationCooldown: number;
}


/**
 * Demuestra cómo usar la librería flowerengine-ts para obtener nodos
 * y luego usar uno de ellos para consultar información de tokens.
 */
async function demonstrateFlowerEngineTs() {
  try {
    console.log("--- Fetching Hive-Engine Nodes ---");
    const nodeResult: NodeUpdateResult = await updateNodesFromAccount("flowerengine");
    const activeNodes = nodeResult.nodes;
    const failingNodes = nodeResult.failing_nodes;

    console.log("\nActive Nodes fetched:");
    activeNodes.forEach(node => console.log(`- ${node}`));

    if (Object.keys(failingNodes).length > 0) {
      console.log("\nFailing Nodes:");
      Object.entries(failingNodes).forEach(([node, reason]) => {
        console.log(`- ${node}: ${reason}`);
      });
    }

    console.log("\n--- Getting Best Node ---");
    const bestNode = await getBestNode("flowerengine");

    if (bestNode) {
      console.log(`Best performing node: ${bestNode}`);

      console.log("\n--- Querying SWAP.HIVE Token Information ---");
      const apiUrl = `${bestNode}/contracts`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "find",
          params: {
            contract: "tokens",
            table: "tokens",
            query: { symbol: "SWAP.HIVE" },
            limit: 1,
          },
        }),
      });

      const data = await response.json() as { result?: TokenInfo[] };
      if (data.result && data.result.length > 0) {
        const tokenInfo: TokenInfo = data.result[0];
        console.log("SWAP.HIVE Token Info:", tokenInfo);
      } else {
        console.log("SWAP.HIVE Token not found or no result.");
      }
    } else {
      console.log("Could not determine a best node to query.");
    }

  } catch (error: any) {
    console.error("An error occurred during demonstration:", error.message);
  }
}

// Ejecutar el ejemplo
demonstrateFlowerEngineTs();
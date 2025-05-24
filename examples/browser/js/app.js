document.addEventListener('DOMContentLoaded', () => {
    const fetchNodesButton = document.getElementById('fetchNodesButton');
    const bestNodeDisplay = document.getElementById('bestNodeDisplay');
    const activeNodesDisplay = document.getElementById('activeNodesDisplay');
    const failingNodesDisplay = document.getElementById('failingNodesDisplay');
    const fullReportDisplay = document.getElementById('fullReportDisplay');

    // Use public Hive nodes for dhive
    const hiveClient = new dhive.Client(['https://api.hive.blog', 'https://api.deathwing.me', 'https://api.openhive.network']);
    const FLOWER_ENGINE_ACCOUNT = 'flowerengine';

    async function getAccountMetadata(accountName) {
        try {
            const accounts = await hiveClient.database.getAccounts([accountName]);
            if (accounts && accounts.length > 0 && accounts[0].json_metadata) {
                return JSON.parse(accounts[0].json_metadata);
            }
            throw new Error('Account metadata not found or empty.');
        } catch (error) {
            console.error(`Error fetching metadata for ${accountName}:`, error);
            throw error;
        }
    }

    function getBestNodeFromMetadata(metadata) {
        if (!metadata || !metadata.nodes || !metadata.report) {
            return 'Metadata incomplete to determine best node.';
        }

        const { nodes, failing_nodes = {}, report } = metadata;
        const availableNodes = nodes.filter(node => !failing_nodes[node]);

        if (availableNodes.length === 0) {
            return 'No available nodes.';
        }

        let bestNode = null;
        let minLatency = Infinity;

        for (const nodeUrl of availableNodes) {
            const nodeReport = report.find(r => r.node === nodeUrl);
            if (nodeReport && nodeReport.latency && nodeReport.latency.ok && typeof nodeReport.latency.ms === 'number' && nodeReport.latency.ms < minLatency) {
                 // Check if essential benchmarks are ok
                if (nodeReport.engine && nodeReport.token.ok && nodeReport.block.ok && nodeReport.config.ok) {
                    minLatency = nodeReport.latency.ms;
                    bestNode = nodeUrl;
                }
            }
        }
        
        // Fallback to the first available node if no suitable report found or no node passed all checks
        return bestNode || availableNodes[0] || 'Could not determine best node from available ones.';
    }


    fetchNodesButton.addEventListener('click', async () => {
        bestNodeDisplay.textContent = 'Fetching...';
        activeNodesDisplay.textContent = 'Fetching...';
        failingNodesDisplay.textContent = 'Fetching...';
        fullReportDisplay.textContent = 'Fetching...';

        try {
            const metadata = await getAccountMetadata(FLOWER_ENGINE_ACCOUNT);

            if (metadata) {
                const bestNode = getBestNodeFromMetadata(metadata);
                bestNodeDisplay.textContent = bestNode;

                activeNodesDisplay.textContent = metadata.nodes
                    ? JSON.stringify(metadata.nodes.filter(node => !metadata.failing_nodes || !metadata.failing_nodes[node]), null, 2)
                    : 'N/A';

                failingNodesDisplay.textContent = metadata.failing_nodes
                    ? JSON.stringify(metadata.failing_nodes, null, 2)
                    : 'N/A';

                // Display a sample of the full report for brevity
                if (metadata.report && metadata.report.length > 0) {
                    const reportSample = metadata.report.slice(0, 2).map(r => ({
                        node: r.node,
                        latency_ms: r.latency ? r.latency.ms : 'N/A',
                        engine_ok: r.engine,
                        token_benchmark_ok: r.token ? r.token.ok : 'N/A'
                    }));
                    fullReportDisplay.textContent = JSON.stringify(reportSample, null, 2) +
                                                 (metadata.report.length > 2 ? '\n... (and more entries)' : '');
                } else {
                    fullReportDisplay.textContent = 'No report data available.';
                }

            } else {
                throw new Error('Failed to retrieve metadata.');
            }

        } catch (error) {
            console.error('Error in fetchNodesButton click handler:', error);
            bestNodeDisplay.textContent = `Error: ${error.message}`;
            activeNodesDisplay.textContent = 'Error';
            failingNodesDisplay.textContent = 'Error';
            fullReportDisplay.textContent = 'Error';
        }
    });
});
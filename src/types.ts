/**
 * Represents the benchmark information for a node.
 */
export interface NodeBenchmark {
  ok: boolean;
  count: number;
  time: number;
  rank: number;
}

/**
 * Represents the configuration information for a node.
 */
export interface NodeConfig {
  ok: boolean;
  time: number;
  access_time: number;
  rank: number;
}

/**
 * Represents the latency information for a node.
 */
export interface NodeLatency {
  ok: boolean;
  min_latency: number;
  max_latency: number;
  avg_latency: number;
  time: number;
  rank: number;
}

/**
 * Represents the detailed report for a specific node.
 */
export interface NodeReport {
  node: string; // Node URL
  SSCnodeVersion: string;
  engine: boolean;
  token: NodeBenchmark;
  contract: NodeBenchmark;
  account_history: NodeBenchmark;
  config: NodeConfig;
  latency: NodeLatency;
  weighted_score: number;
  tests_completed: number;
}

/**
 * Represents the structure of the parameters from the last report execution.
 */
export interface ReportParameters {
  start_time: string;
  end_time: string;
  duration: number;
  timestamp: string;
  nectar_engine_version: string;
  script_version: string;
  num_retries: number;
  num_retries_call: number;
  timeout: number;
  threading: boolean;
  seconds: number;
  account_name: string;
  token: string;
  contract: string;
  benchmarks: {
    token: { data: string[] };
    contract: { data: string[] };
    account_history: { data: string[] };
    config: { data: string[] };
    latency: { data: string[] };
  };
  weighted_scoring: {
    weights: {
      token: number;
      contract: number;
      account_history: number;
      config: number;
      latency: number;
    };
    description: string;
  };
}

/**
 * Represents the complete structure of the FlowerEngine account's JSON metadata.
 */
export interface FlowerEngineMetadata {
  nodes: string[];
  failing_nodes: { [url: string]: string }; // Object where the key is the URL and the value is the reason for failure
  report: NodeReport[];
  parameter: ReportParameters;
}

/**
 * Interface for the result of the updateNodesFromAccount function.
 */
export interface NodeUpdateResult {
  nodes: string[];
  failing_nodes: { [url: string]: string };
  fullMetadata?: FlowerEngineMetadata; // Optional: to return all metadata
}
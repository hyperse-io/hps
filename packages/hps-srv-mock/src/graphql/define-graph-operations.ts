import type { StrategyViolativeOperations } from '../types/types-graphql.js';

export function defineStrategyViolativeOperations<T extends { types: any }>(
  config: StrategyViolativeOperations<T>
): StrategyViolativeOperations<T> {
  return config;
}

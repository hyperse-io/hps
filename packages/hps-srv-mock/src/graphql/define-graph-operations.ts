import type {
  IgnoreOperations,
  StrategyViolativeOperations,
} from '../types/types-graphql.js';

export function defineStrategyViolativeOperations<T extends { types: any }>(
  config: StrategyViolativeOperations<T>
): StrategyViolativeOperations<T> {
  return config;
}

export function defineIgnoreOperations<T extends { types: any }>(
  config: IgnoreOperations<T>
): IgnoreOperations<T> {
  return config;
}

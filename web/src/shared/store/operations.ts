import { create } from "zustand";

export type OperationStatus = "idle" | "in-progress" | "done" | "failed";
export type StepStatus = "planned" | "in-progress" | "done" | "failed";

export interface Step {
  id: string;
  name: string;
  status: StepStatus;
  message?: string;
  timestamp: number;
}

export interface Operation {
  id: string;
  name: string;
  status: OperationStatus;
  steps: Step[];
  createdAt: number;
  completedAt?: number;
  error?: string;
}

interface OperationsState {
  operations: Operation[];
  addOperation: (operation: Operation) => void;
  updateOperation: (id: string, updates: Partial<Operation>) => void;
  addStep: (operationId: string, step: Step) => void;
  updateStep: (
    operationId: string,
    stepId: string,
    updates: Partial<Step>,
  ) => void;
  clearOperations: () => void;
}

/**
 * Zustand store for tracking operations and their steps
 */
export const useOperationsStore = create<OperationsState>((set) => ({
  operations: [],

  addOperation: (operation: Operation) => {
    set((state) => ({ operations: [operation, ...state.operations] }));
  },

  updateOperation: (id: string, updates: Partial<Operation>) => {
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === id ? { ...op, ...updates } : op,
      ),
    }));
  },

  addStep: (operationId: string, step: Step) => {
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === operationId
          ? {
              ...op,
              steps: [step, ...op.steps],
            }
          : op,
      ),
    }));
  },

  updateStep: (operationId: string, stepId: string, updates: Partial<Step>) => {
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === operationId
          ? {
              ...op,
              steps: op.steps.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step,
              ),
            }
          : op,
      ),
    }));
  },

  clearOperations: () => {
    set({ operations: [] });
  },
}));

/**
 * Global operations store instance for non-component usage
 */
export const operationsStore = {
  get operations() {
    return useOperationsStore.getState().operations;
  },
  addOperation: (operation: Operation) =>
    useOperationsStore.getState().addOperation(operation),
  updateOperation: (id: string, updates: Partial<Operation>) =>
    useOperationsStore.getState().updateOperation(id, updates),
  addStep: (operationId: string, step: Step) =>
    useOperationsStore.getState().addStep(operationId, step),
  updateStep: (operationId: string, stepId: string, updates: Partial<Step>) =>
    useOperationsStore.getState().updateStep(operationId, stepId, updates),
  clearOperations: () => useOperationsStore.getState().clearOperations(),
};

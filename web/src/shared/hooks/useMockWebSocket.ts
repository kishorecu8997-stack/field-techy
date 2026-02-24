import { useEffect, useRef } from "react";

type Listener = (payload?: any) => void;

// Module-level simple event registry so multiple components/hooks share events
const listeners: Record<string, Set<Listener>> = {};

const on = (event: string, cb: Listener) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(cb);
};

const off = (event: string, cb: Listener) => {
  listeners[event]?.delete(cb);
};

const send = (event: string, payload?: any) => {
  // Simulate network latency
  const fns = Array.from(listeners[event] || []);
  setTimeout(() => {
    fns.forEach((fn) => fn(payload));
  }, 250);
};

const simulateIncomingCall = (payload?: any) => {
  send(
    "incoming_call",
    payload ?? {
      id: `mock-${Date.now()}`,
      callerName: "Kraft And Co (Client)",
      callType: "Voice Call",
      metadata: {},
    },
  );
};

export const useMockWebSocket = () => {
  // Provide stable callbacks for components; nothing to cleanup at module-level
  const ref = useRef({ on, off, send, simulateIncomingCall });

  useEffect(() => {
    return () => {
      // no-op: keep module-level listeners for lifecycle of app
    };
  }, []);

  return ref.current;
};

export default useMockWebSocket;

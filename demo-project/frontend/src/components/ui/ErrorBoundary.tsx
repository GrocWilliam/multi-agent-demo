import { Component, type ErrorInfo, type ReactNode } from "react";
import { copy } from "../../copy";
import { Button } from "./Button";
import { StatusMessage } from "./StatusMessage";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="mx-auto max-w-xl p-6">
        <StatusMessage
          variant="error"
          message={copy.error}
          action={<Button onClick={() => window.location.reload()}>{copy.retry}</Button>}
        />
      </div>
    );
  }
}

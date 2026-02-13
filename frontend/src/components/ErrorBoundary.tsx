import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-rasta-cream px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex justify-center gap-2">
              <span className="h-4 w-4 rounded-full bg-rasta-red" />
              <span className="h-4 w-4 rounded-full bg-rasta-yellow" />
              <span className="h-4 w-4 rounded-full bg-rasta-green" />
            </div>
            <h1 className="text-2xl font-bold text-rasta-black">
              Something went wrong
            </h1>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-md bg-rasta-green px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-rasta-green/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

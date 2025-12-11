import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 absolute top-10 left-10 z-50 shadow-xl max-w-lg">
          <h2 className="text-lg font-bold mb-2">Something went wrong.</h2>
          <details className="whitespace-pre-wrap text-sm font-mono bg-red-100 p-2 rounded">
            {this.state.error && this.state.error.toString()}
          </details>
          <button 
             onClick={() => window.location.reload()}
             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
             Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

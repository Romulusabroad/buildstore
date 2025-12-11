
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface LogoTickerProps {
  speed?: 'slow' | 'medium' | 'fast';
  grayscale?: boolean;
  className?: string;
}

const speedMap = {
  slow: '40s',
  medium: '25s',
  fast: '15s',
};

// Placeholder logos using simple SVG shapes
const PlaceholderLogos = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-center w-32 h-12 mx-8 opacity-50 hover:opacity-100 transition-opacity"
      >
        <svg
          viewBox="0 0 120 40"
          className="w-full h-full fill-current text-gray-400"
        >
          {i % 3 === 0 && (
            <rect x="10" y="10" width="100" height="20" rx="4" />
          )}
          {i % 3 === 1 && (
            <circle cx="60" cy="20" r="18" />
          )}
          {i % 3 === 2 && (
            <>
              <rect x="20" y="5" width="30" height="30" rx="4" />
              <rect x="55" y="12" width="45" height="8" rx="2" />
              <rect x="55" y="24" width="30" height="6" rx="2" />
            </>
          )}
        </svg>
      </div>
    ))}
  </>
);

export const LogoTicker = ({
  speed = 'medium',
  grayscale = true,
  className,
}: LogoTickerProps) => {
  const { connectors: { connect, drag } } = useNode();
  const duration = speedMap[speed];

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'w-full overflow-hidden py-8',
        grayscale && 'grayscale',
        className
      )}
    >
      <div
        className="flex animate-scroll"
        style={{
          animation: `scroll ${duration} linear infinite`,
        }}
      >
        <PlaceholderLogos />
        <PlaceholderLogos />
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          width: fit-content;
        }
      `}</style>
    </div>
  );
};

LogoTicker.craft = {
  displayName: 'LogoTicker',
  props: {
    speed: 'medium',
    grayscale: true,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: LogoTickerSettings,
  },
};

function LogoTickerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      {/* Speed */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Speed</label>
        <div className="grid grid-cols-3 gap-2">
          {['slow', 'medium', 'fast'].map((s) => (
            <button
              key={s}
              onClick={() => setProp((p: LogoTickerProps) => (p.speed = s as LogoTickerProps['speed']))}
              className={cn(
                'px-3 py-2 text-xs rounded border transition-all capitalize',
                props.speed === s
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grayscale Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Grayscale</span>
        <button
          onClick={() => setProp((p: LogoTickerProps) => (p.grayscale = !p.grayscale))}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            props.grayscale ? 'bg-blue-600' : 'bg-gray-200'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              props.grayscale ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </div>
  );
}

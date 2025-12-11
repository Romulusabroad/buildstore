import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

interface DecorationLayerProps {
  effect: 'snow' | 'confetti' | 'neon' | 'none';
  intensity?: 'light' | 'medium' | 'heavy';
  children?: ReactNode;
}

// CSS Keyframes for effects
const styles = `
@keyframes snowfall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
}

@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(720deg); }
}

@keyframes neon-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.snowflake {
  position: absolute;
  color: white;
  font-size: 1.5rem;
  animation: snowfall linear infinite;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall linear infinite;
  pointer-events: none;
}

.neon-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: neon-pulse ease-in-out infinite;
  pointer-events: none;
  box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
}
`;

const generateSnowflakes = (count: number) => {
  const flakes = [];
  for (let i = 0; i < count; i++) {
    flakes.push(
      <span
        key={i}
        className="snowflake"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${0.5 + Math.random() * 1.5}rem`,
        }}
      >
        ❄
      </span>
    );
  }
  return flakes;
};

const generateConfetti = (count: number) => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
  const confetti = [];
  for (let i = 0; i < count; i++) {
    confetti.push(
      <div
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${2 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 3}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
        }}
      />
    );
  }
  return confetti;
};

const generateNeonParticles = (count: number) => {
  const colors = ['#ff00ff', '#00ffff', '#ff0080', '#8000ff', '#0080ff'];
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(
      <div
        key={i}
        className="neon-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${1 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    );
  }
  return particles;
};

export const DecorationLayer = ({ 
  effect = 'none',
  intensity = 'medium',
  children,
}: DecorationLayerProps) => {
  const { connectors: { connect, drag } } = useNode();

  const particleCount = {
    light: 15,
    medium: 30,
    heavy: 50,
  }[intensity];

  const renderEffect = () => {
    switch (effect) {
      case 'snow':
        return generateSnowflakes(particleCount);
      case 'confetti':
        return generateConfetti(particleCount);
      case 'neon':
        return generateNeonParticles(particleCount);
      default:
        return null;
    }
  };

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
      className="relative overflow-hidden"
    >
      <style>{styles}</style>
      
      {/* Effect Layer */}
      {effect !== 'none' && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {renderEffect()}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

const DecorationLayerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Effect</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'none', name: 'None', emoji: '⬜' },
            { id: 'snow', name: 'Snow', emoji: '❄️' },
            { id: 'confetti', name: 'Confetti', emoji: '🎊' },
            { id: 'neon', name: 'Neon', emoji: '✨' },
          ].map((e) => (
            <button
              key={e.id}
              onClick={() => setProp((p: DecorationLayerProps) => p.effect = e.id as DecorationLayerProps['effect'])}
              className={`p-2 rounded-lg border text-sm flex items-center gap-2 ${
                props.effect === e.id 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{e.emoji}</span>
              <span>{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Intensity</label>
        <div className="flex gap-2">
          {['light', 'medium', 'heavy'].map((i) => (
            <button
              key={i}
              onClick={() => setProp((p: DecorationLayerProps) => p.intensity = i as DecorationLayerProps['intensity'])}
              className={`flex-1 px-3 py-2 rounded-lg text-sm capitalize ${
                props.intensity === i 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

DecorationLayer.craft = {
  displayName: 'Decoration Layer',
  props: {
    effect: 'snow',
    intensity: 'medium',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: DecorationLayerSettings,
  },
};

export default DecorationLayer;

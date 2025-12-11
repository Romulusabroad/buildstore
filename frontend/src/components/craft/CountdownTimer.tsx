import { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  label?: string;
  bgColor?: string;
  textColor?: string;
}

export const CountdownTimer = ({ 
  endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  label = 'Sale Ends In',
  bgColor = '#ef4444',
  textColor = '#ffffff',
}: CountdownTimerProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div 
        className="text-3xl md:text-5xl font-bold px-3 py-2 rounded-lg"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs uppercase mt-1 opacity-80">{label}</span>
    </div>
  );

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
      className="p-6 rounded-2xl text-center"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <span className="text-lg font-semibold">{label}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="text-3xl font-bold">:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="text-3xl font-bold">:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span className="text-3xl font-bold">:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

const CountdownTimerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={props.label || 'Sale Ends In'}
          onChange={(e) => setProp((p: CountdownTimerProps) => p.label = e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
        <input
          type="datetime-local"
          value={props.endTime?.slice(0, 16) || ''}
          onChange={(e) => setProp((p: CountdownTimerProps) => p.endTime = new Date(e.target.value).toISOString())}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
          <input
            type="color"
            value={props.bgColor || '#ef4444'}
            onChange={(e) => setProp((p: CountdownTimerProps) => p.bgColor = e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Text</label>
          <input
            type="color"
            value={props.textColor || '#ffffff'}
            onChange={(e) => setProp((p: CountdownTimerProps) => p.textColor = e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

CountdownTimer.craft = {
  displayName: 'Countdown Timer',
  props: {
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    label: 'Sale Ends In',
    bgColor: '#ef4444',
    textColor: '#ffffff',
  },
  related: {
    settings: CountdownTimerSettings,
  },
};

export default CountdownTimer;

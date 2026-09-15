import React from 'react';
import { SectionKey, Waypoint, ProjectedWaypoint } from '../types';
import { soundManager } from '../audio/soundManager';
import { User, Laptop, Wrench, BookOpen, Send } from 'lucide-react';

interface WaypointPinsProps {
  activeSection: SectionKey;
  onSelectWaypoint: (waypoint: Waypoint) => void;
  projectedWaypoints: ProjectedWaypoint[];
}

const ICONS: Record<string, React.ReactNode> = {
  User: <User className="w-3.5 h-3.5" />,
  Laptop: <Laptop className="w-3.5 h-3.5" />,
  Wrench: <Wrench className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Send: <Send className="w-3.5 h-3.5" />,
};

export const WaypointPins: React.FC<WaypointPinsProps> = ({
  activeSection,
  onSelectWaypoint,
  projectedWaypoints,
}) => {
  if (!projectedWaypoints || projectedWaypoints.length === 0) return null;

  return (
    <div id="waypoint-pins-layer" className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {projectedWaypoints.map((wp) => {
        if (!wp.visible) return null;
        const isActive = activeSection === wp.sectionKey;

        return (
          <div
            key={wp.id}
            style={{
              left: `${wp.x}px`,
              top: `${wp.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute pointer-events-auto transition-transform duration-75"
          >
            <div className="relative flex flex-col items-center group">
              {/* Pulsing Beacon Rings */}
              <div className="relative mb-2">
                <span
                  style={{ backgroundColor: wp.color }}
                  className="absolute -inset-1 rounded-full animate-ping opacity-60"
                />
                <span
                  style={{ backgroundColor: wp.color }}
                  className="relative block w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg"
                />
              </div>

              {/* Waypoint Card Button */}
              <button
                id={`pin-${wp.id}`}
                onClick={() => {
                  soundManager.playChimeSound();
                  onSelectWaypoint({
                    id: wp.id,
                    number: wp.number,
                    title: wp.title,
                    subtitle: wp.subtitle,
                    iconName: wp.iconName,
                    position: [0, 0, 0], // populated from data
                    sectionKey: wp.sectionKey,
                    color: wp.color,
                  });
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-left border shadow-2xl backdrop-blur-md transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-white/95 dark:bg-slate-900/95 border-pink-500 shadow-pink-500/30 scale-105 ring-4 ring-pink-500/30'
                    : 'bg-white/80 dark:bg-slate-900/80 border-white/70 dark:border-slate-700/70 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 active:scale-95'
                }`}
              >
                {/* Number Badge */}
                <span
                  style={{ backgroundColor: wp.color }}
                  className="flex items-center justify-center w-5 h-5 rounded-lg text-[10px] font-black text-white shadow-xs shrink-0"
                >
                  {wp.number}
                </span>

                <div className="flex flex-col whitespace-nowrap">
                  <span className="text-[11px] font-extrabold tracking-wider text-slate-900 dark:text-white uppercase leading-none flex items-center gap-1">
                    {wp.title}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5 flex items-center gap-1">
                    {wp.subtitle} {ICONS[wp.iconName]}
                  </span>
                </div>
              </button>

              {/* Little Down Pointer Arrow */}
              <div
                style={{ borderTopColor: wp.color }}
                className="w-0 h-0 border-x-4 border-x-transparent border-t-6 opacity-80 mt-1"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

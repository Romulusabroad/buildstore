import React from 'react';
import { useEditor } from '@craftjs/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const SettingsPanel = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { selected, actions } = useEditor((state, query) => {
    // state.events.selected is a Set<string>
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId && state.nodes[currentNodeId]) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
    };
  });


  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 relative ${isOpen ? 'w-80' : 'w-0'}`}>
       {/* Collapse Toggle Button - Always Visible */}
      <button 
        onClick={onToggle}
        className="absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md z-50 hover:bg-gray-50 text-gray-500 flex items-center justify-center w-6 h-6"
        style={{ left: '-12px' }}
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Content Container - Clips overflow when closed */}
      <div className="flex flex-col h-full w-80 overflow-hidden">
        {selected ? (
          <div className="p-4 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-700">Settings</h2>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                {selected.name}
              </span>
            </div>
            
            {/* If the component has defined settings, render them */}
            <div className="flex-1 overflow-y-auto">
              {selected.settings && React.createElement(selected.settings)}
            </div>

            {selected.isDeletable ? (
              <button
                className="w-full mt-auto p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded border border-red-200 transition-colors"
                onClick={() => {
                  actions.delete(selected.id);
                }}
              >
                Delete Component
              </button>
            ) : null}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                  👆
              </div>
              <h3 className="text-gray-900 font-medium mb-2">No Selection</h3>
              <p className="text-gray-500 text-sm">
                  Select any component on the canvas to edit its properties here.
              </p>
              <p className="text-gray-400 text-xs mt-4">
                  (Add new components from the Left Sidebar)
              </p>
          </div>
        )}
      </div>
    </div>
  );
};



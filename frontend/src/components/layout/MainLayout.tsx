import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import RightPanel from './RightPanel';
import StarfieldBackground from '../ui/StarfieldBackground';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const showStarfield = currentPage === 'home';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text font-sans transition-colors duration-300">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        <TopNav onTogglePanel={() => setShowRightPanel(prev => !prev)} isPanelOpen={showRightPanel} />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* Galaxy background — covers entire main area */}
          {showStarfield && (
            <div className="absolute inset-0 z-0">
              <StarfieldBackground />
            </div>
          )}
          {/* Content — on top of starfield */}
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </main>
      </div>
      
      {/* Right Panel — slides in/out */}
      <div className={`transition-all duration-300 ease-in-out ${showRightPanel ? 'w-[280px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <RightPanel />
      </div>
    </div>
  );
}

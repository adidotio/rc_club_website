import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { EventPasses } from './components/EventPasses';
import { ScheduleVenue } from './components/ScheduleVenue';
import { Footer } from './components/Footer';
import { PassModal } from './components/PassModal';

export function App() {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<'destroy' | 'soccer' | 'rc_race'>('destroy');

  const handleOpenPass = (event: 'destroy' | 'soccer' | 'rc_race' = 'destroy') => {
    setSelectedPass(event);
    setIsPassModalOpen(true);
  };

  const handleClosePass = () => {
    setIsPassModalOpen(false);
  };

  const handleSelectExperience = (event: 'destroy' | 'soccer' | 'rc_race' | 'expo') => {
    if (event === 'expo') {
      // Scroll to expo or show pass info
      setSelectedPass('destroy');
      setIsPassModalOpen(true);
    } else {
      setSelectedPass(event);
      setIsPassModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-red selection:text-white">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar onGetPassClick={() => handleOpenPass('destroy')} />

      {/* Main Page Sections */}
      <main className="w-full overflow-hidden">
        <Hero onGetPassClick={() => handleOpenPass('destroy')} />
        <About />
        <Experience onSelectEvent={handleSelectExperience} />
        <EventPasses 
          onSelectPass={(pass) => handleOpenPass(pass)} 
          onExploreClick={() => handleOpenPass('destroy')} 
        />
        <ScheduleVenue />
      </main>

      {/* Footer Section (07 Ready To Enter?) */}
      <Footer onGetPassClick={() => handleOpenPass('destroy')} />

      {/* Interactive Registration & Ticket Pass Modal */}
      <PassModal 
        isOpen={isPassModalOpen} 
        onClose={handleClosePass} 
        initialEvent={selectedPass}
      />
    </div>
  );
}

export default App;

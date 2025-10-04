
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-[#FFA5A5] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
            1
          </div>
          <h3 className="font-bold mb-2">Plan your day</h3>
          <p className="text-gray-600">Organize tasks and set priorities for what matters most</p>
        </div>
        
        {/* Step 2 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-[#FFA5A5] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
            2
          </div>
          <h3 className="font-bold mb-2">Focus in Timed Sessions</h3>
          <p className="text-gray-600">Work distraction-free with customizable focus intervals</p>
        </div>
        
        {/* Step 3 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-[#FFA5A5] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
            3
          </div>
          <h3 className="font-bold mb-2">Track your Progress</h3>
          <p className="text-gray-600">Visualize your productivity patterns and celebrate wins</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;


import React from 'react';
import { Calendar } from 'lucide-react';

const FeaturePreview: React.FC = () => {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Chart - Updated as requested */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Productivity Trend</h3>
          <Calendar className="text-[#FFA5A5]" size={20} />
        </div>
        <div className="h-40 flex items-end space-x-2">
          {[
            { day: "Mon", height: "40%" },
            { day: "Tue", height: "25%" },
            { day: "Wed", height: "35%" },
            { day: "Thu", height: "75%", highlight: true },
            { day: "Fri", height: "60%" },
            { day: "Sat", height: "45%" },
            { day: "Sun", height: "70%" }
          ].map((item, index) => (
            <div key={item.day} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full ${item.highlight ? 'bg-blue-400' : 'bg-[#FFA5A5]'}`}
                style={{ height: item.height }}
              ></div>
              <span className="text-xs mt-2 text-gray-500">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
        <div className="w-40 h-40 rounded-full border-8 border-[#FFA5A5] relative flex items-center justify-center">
          <div className="absolute w-1 h-16 bg-[#FFA5A5] top-0 left-1/2 transform -translate-x-1/2 origin-bottom rotate-0"></div>
          <div className="absolute w-1 h-10 bg-[#FFA5A5] top-[50px] left-1/2 transform -translate-x-1/2 origin-bottom rotate-90"></div>
          <div className="text-2xl font-bold">25:00</div>
          <div className="absolute -bottom-3 bg-white px-2">
            <span className="text-[#FFA5A5] text-sm font-bold">FOCUS</span>
          </div>
        </div>
      </div>

      {/* Tasks - Updated as requested with hover effect */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-center">
        <div className="space-y-4">
          <button className="bg-[#FFA5A5] text-white py-2 px-4 rounded-full w-full hover:bg-[#ff8c8c] transition-colors">
            Complete Project
          </button>
          <button className="bg-gray-200 py-2 px-4 rounded-full w-full hover:bg-[#FFA5A5] hover:text-white transition-colors">
            Manage Tasks
          </button>
          <button className="bg-gray-200 py-2 px-4 rounded-full w-full hover:bg-[#FFA5A5] hover:text-white transition-colors">
            Increase Productivity
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturePreview;

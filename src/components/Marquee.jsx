import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Marquee = () => {
  return (
    <div className="bg-red-700 text-white py-3">
      <div className="container mx-auto px-4 flex items-center">
        <FaExclamationCircle className="mr-3 text-lg flex-shrink-0" />
        <div className="overflow-hidden whitespace-nowrap">
          <span className="animate-marquee inline-block pl-[100%] marquee-text">
            UPSC Civil Services Exam 2024 Notification Released | SSC CHSL 2023 Tier 2 Admit Card Available | 
            IBPS PO 2023 Final Result Declared | Railway Group D Phase 3 Exam Date Announced | 
            UPPSC PCS 2023 Prelims Result Declared | Bihar Police SI Recruitment 2023 Notification
          </span>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
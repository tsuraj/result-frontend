import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const NotificationBar = () => {
  return (
    <div className="bg-yellow-500 text-white py-2">
      <div className="container mx-auto px-4 flex items-center">
        <FaExclamationCircle className="mr-2 animate-pulse" />
        <div className="overflow-hidden whitespace-nowrap">
          <span className="animate-marquee inline-block pl-[100%]">
            UPSC Civil Services Exam 2024 Notification Released | SSC CHSL 2023 Tier 2 Admit Card Available | 
            IBPS PO 2023 Final Result Declared | Railway Group D Phase 3 Exam Date Announced
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar; pind
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <button
            onClick={() => handleToggle(index)}
            className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-black/20"
          >
            <span className="text-lg font-medium">{item.question}</span>
            <ChevronDown
              size={24}
              className={`transform transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: openIndex === index ? '1000px' : '0' }}
          >
            <div className="py-4 px-4 text-gray-600">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
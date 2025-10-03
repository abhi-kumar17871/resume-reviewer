import FaqAccordion from '@/components/FaqAccordion';
import { Mail, LifeBuoy } from 'lucide-react';

const faqItems = [
  {
    question: "How do I upload my resume?",
    answer: "Navigate to your Dashboard. If you haven't submitted a resume yet, you'll see an 'Upload Resume' button. Click it, and a modal will appear where you can drag and drop or select your PDF file."
  },
  {
    question: "How long does a review take?",
    answer: "Our reviewers typically provide feedback within 2-3 business days. You will receive an email notification (if enabled) once your review is complete."
  },
  {
    question: "Can I submit more than one resume?",
    answer: "Yes, you can submit updated versions of your resume at any time from the Dashboard. Your full submission history can be viewed on the 'Resume History' page."
  },
  {
    question: "How do I turn off email notifications?",
    answer: "Go to the 'Settings' page from the sidebar. There you will find a toggle switch to enable or disable email notifications for when your resume is reviewed."
  },
  {
    question: "What does the 'Score' on my review mean?",
    answer: "The score is a general indicator of how well your resume aligns with industry best practices, based on criteria like formatting, clarity, and keyword optimization. It's a guide to help you identify areas for improvement."
  }
];

export default function HelpPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto">
        <div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Help & Support
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions? We're here to help. Find answers to common questions below.
          </p>
        </div>

        <div className="mt-12">
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>

        <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold">Still need help?</h2>
          <p className="mt-2 text-gray-600">
            If you can't find the answer you're looking for, please reach out to our support team.
          </p>
          <a
            href="mailto:support@example.com"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <Mail size={16} />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
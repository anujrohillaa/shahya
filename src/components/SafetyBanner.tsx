import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 sm:p-4 flex items-start gap-3 text-amber-900">
      <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <span className="font-bold block sm:inline mr-1">Safety Advisory:</span>
        Always visit the accommodation in person and verify flatmates before paying any token amount or security deposit. Shahya never charges any fee to connect or chat.
      </div>
    </div>
  );
}

import { Scroll } from 'lucide-react';
import React from 'react';

export const DataTableNoData = (): React.JSX.Element => {
  return (
    <div className="p-6 text-center">
      <div className="rounded-full border flex justify-center bg-gray-200 items-center w-[40px] h-[40px] mx-auto">
        <Scroll color="#2657e8" strokeWidth={1.5} className="w-6" />
      </div>
      <h3 className="mt-6 font-semibold text-sm">I feel empty...</h3>
    </div>
  );
};

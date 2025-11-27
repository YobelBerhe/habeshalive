import { useEffect, useRef, useState } from "react";

interface ScrollableDatePickerProps {
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  onDateChange: (day: number, month: number, year: number) => void;
}

export function ScrollableDatePicker({
  selectedDay,
  selectedMonth,
  selectedYear,
  onDateChange,
}: ScrollableDatePickerProps) {
  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 83 }, (_, i) => 2006 - i);

  useEffect(() => {
    // Center selected items on mount
    if (dayRef.current) {
      const dayElement = dayRef.current.querySelector(`[data-value="${selectedDay}"]`);
      if (dayElement) {
        dayElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    if (monthRef.current) {
      const monthElement = monthRef.current.querySelector(`[data-value="${selectedMonth}"]`);
      if (monthElement) {
        monthElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    if (yearRef.current) {
      const yearElement = yearRef.current.querySelector(`[data-value="${selectedYear}"]`);
      if (yearElement) {
        yearElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, type: 'day' | 'month' | 'year') => {
    if (!ref.current) return;

    const container = ref.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestElement: Element | null = null;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.top + childRect.height / 2;
      const distance = Math.abs(childCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = child;
      }
    });

    if (closestElement) {
      const value = parseInt(closestElement.getAttribute('data-value') || '0');
      if (type === 'day') {
        onDateChange(value, selectedMonth, selectedYear);
      } else if (type === 'month') {
        onDateChange(selectedDay, value, selectedYear);
      } else {
        onDateChange(selectedDay, selectedMonth, value);
      }
    }
  };

  return (
    <div className="relative">
      {/* Selection indicator */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 pointer-events-none z-10">
        <div className="h-full border-t border-b border-white/10"></div>
      </div>

      <div className="grid grid-cols-3 gap-8 h-64 relative">
        {/* Day Picker */}
        <div
          ref={dayRef}
          onScroll={() => handleScroll(dayRef, 'day')}
          className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollPaddingTop: "108px", scrollPaddingBottom: "108px" }}
        >
          <div className="h-24"></div>
          {days.map((day) => (
            <div
              key={day}
              data-value={day}
              onClick={() => {
                onDateChange(day, selectedMonth, selectedYear);
                dayRef.current?.querySelector(`[data-value="${day}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
              className={`h-14 flex items-center justify-center text-2xl snap-center cursor-pointer transition-all ${
                selectedDay === day ? "text-white font-bold scale-110" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
          <div className="h-24"></div>
        </div>

        {/* Month Picker */}
        <div
          ref={monthRef}
          onScroll={() => handleScroll(monthRef, 'month')}
          className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollPaddingTop: "108px", scrollPaddingBottom: "108px" }}
        >
          <div className="h-24"></div>
          {months.map((month) => (
            <div
              key={month}
              data-value={month}
              onClick={() => {
                onDateChange(selectedDay, month, selectedYear);
                monthRef.current?.querySelector(`[data-value="${month}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
              className={`h-14 flex items-center justify-center text-2xl snap-center cursor-pointer transition-all ${
                selectedMonth === month ? "text-white font-bold scale-110" : "text-gray-600"
              }`}
            >
              {month}
            </div>
          ))}
          <div className="h-24"></div>
        </div>

        {/* Year Picker */}
        <div
          ref={yearRef}
          onScroll={() => handleScroll(yearRef, 'year')}
          className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollPaddingTop: "108px", scrollPaddingBottom: "108px" }}
        >
          <div className="h-24"></div>
          {years.map((year) => (
            <div
              key={year}
              data-value={year}
              onClick={() => {
                onDateChange(selectedDay, selectedMonth, year);
                yearRef.current?.querySelector(`[data-value="${year}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
              className={`h-14 flex items-center justify-center text-2xl snap-center cursor-pointer transition-all ${
                selectedYear === year ? "text-white font-bold scale-110" : "text-gray-600"
              }`}
            >
              {year}
            </div>
          ))}
          <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
}

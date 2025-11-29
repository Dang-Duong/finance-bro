"use client";

export default function BudgetChart() {
  const data = [
    { label: "Food",        value: 5000 },
    { label: "Housing",     value: 10000 },
    { label: "Transport",   value: 5000 },
    { label: "Subscription",value: 1500 },
  ];

  const maxValue = 10000;
  const barAreaHeight = 320; 

  return (
    <div className="bg-[#0F1C2E] p-6 rounded-2xl w-full h-[450px]">
      <div className="flex h-full">
        <div
          className="flex flex-col justify-between text-gray-500 text-xs pr-6"
          style={{ height: barAreaHeight }}
        >
          <span>10000</span>
          <span>8000</span>
          <span>5000</span>
          <span>3000</span>
          <span>1000</span>
        </div>

        {/* Sloupce + popisky odděleně */}
        <div className="flex-1 flex flex-col">
          {/* oblast pro sloupce */}
          <div
            className="flex items-end justify-around"
            style={{ height: barAreaHeight }}
          >
            {data.map((item, idx) => {
              const height = (item.value / maxValue) * barAreaHeight;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 rounded-xl"
                    style={{
                      height: `${height}px`,
                      background:
                        "linear-gradient(to top, #F58989 60%, #6FA8FF 100%)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* popisky kategorií pod sloupci */}
          <div className="flex justify-around mt-3 text-xs text-gray-400">
            {data.map((item, idx) => (
              <span key={idx}>{item.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

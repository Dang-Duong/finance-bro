"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Landmark, Plane, CarFront } from "lucide-react";
import TrashIcon from "@/components/icons/TrashIcon";

// ---------- TYPES ----------

export type SavingGoalId = "emergency" | "vacation" | "car";

export interface SavingGoal {
  id: SavingGoalId;
  name: string;
  goalAmount: number;
  currentAmount: number;
}

export interface SavingDeposit {
  id: string;
  date: string;
  amount: number;
  goalId: SavingGoalId;
}

// ---------- CONSTANTS ----------

const goalLabel: Record<SavingGoalId, string> = {
  emergency: "Emergency found",
  vacation: "Vacation",
  car: "New car",
};

const goalIconConfig: Record<
  SavingGoalId,
  { Icon: LucideIcon; barColor: string; iconColor: string }
> = {
  emergency: {
    Icon: Landmark,
    barColor: "#0b5cf5",
    iconColor: "#1e88ff",
  },
  vacation: {
    Icon: Plane,
    barColor: "#2ae349",
    iconColor: "#25c63f",
  },
  car: {
    Icon: CarFront,
    barColor: "#9cff3a",
    iconColor: "#8ae433",
  },
};

// ---------- PROPS ----------

interface SavingsContentProps {
  goals: SavingGoal[];
  deposits: SavingDeposit[];
  onAddDeposit: () => void;
  onDeleteDeposit: (id: string) => void;
}

// ---------- MAIN COMPONENT ----------

export function SavingsContent({
  goals,
  deposits,
  onAddDeposit,
  onDeleteDeposit,
}: SavingsContentProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const totalGoal = goals.reduce((sum, g) => sum + g.goalAmount, 0);
  const currentSituation = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const sortedDeposits = [...deposits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto max-w-6xl rounded-3xl bg-[#041633] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Savings</h1>

        <div className="flex gap-3 md:justify-end">
          <button
            onClick={onAddDeposit}
            className="rounded-full bg-[#0b5cf5] px-8 py-2 text-sm font-medium hover:bg-[#0a4cd0]"
          >
            Add
          </button>
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className={`rounded-full px-8 py-2 text-sm font-medium ${
              isEditMode
                ? "bg-white/90 text-[#041633]"
                : "bg-[#0b5cf5] text-white hover:bg-[#0a4cd0]"
            }`}
          >
            {isEditMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Layout (2 columns) */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
        {/* Left – goals */}
        <div className="space-y-10">
          {/* Total & Current */}
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard label="TOTAL GOAL" value={totalGoal} />
            <SummaryCard
              label="CURRENT SITUATION"
              value={currentSituation}
              variant="accent"
            />
          </div>

          {/* Goals list */}
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalRow key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Right – history */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-lg font-semibold md:text-xl">
            History of deposit
          </h2>
          <div className="mb-4 h-px w-full bg-white/20" />

          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-white/5">
                {sortedDeposits.map((d) => (
                  <tr key={d.id} className="align-middle">
                    {/* Date */}
                    <td className="whitespace-nowrap py-3 pr-4 text-xs text-white/80 sm:text-sm">
                      {new Date(d.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap py-3 pr-4 text-xs font-semibold text-[#29e37a] sm:text-sm">
                      {d.amount.toLocaleString("cs-CZ")} CZK
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap py-3 pr-4 text-xs text-white/80 sm:text-sm">
                      {goalLabel[d.goalId]}
                    </td>

                    {/* Delete in edit mode */}
                    {isEditMode && (
                      <td className="py-3 pl-2 text-right text-xs sm:text-sm">
                        <button
                          onClick={() => onDeleteDeposit(d.id)}
                          className="rounded-md px-2 py-1 text-red-400 hover:bg-red-500/10"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {sortedDeposits.length === 0 && (
                  <tr>
                    <td
                      colSpan={isEditMode ? 4 : 3}
                      className="py-6 text-center text-sm text-white/50"
                    >
                      No deposits yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- SUMMARY CARD ----------

interface SummaryCardProps {
  label: string;
  value: number;
  variant?: "default" | "accent";
}

function SummaryCard({ label, value, variant = "default" }: SummaryCardProps) {
  const accent = variant === "accent";

  return (
    <div
      className={`rounded-2xl px-8 py-5 text-sm sm:text-base ${
        accent ? "bg-[#043552]" : "bg-[#032447]"
      }`}
    >
      <div className="text-[11px] font-medium uppercase tracking-wide text-white/70">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold sm:text-3xl ${
          accent ? "text-[#12e58b]" : ""
        }`}
      >
        {value.toLocaleString("cs-CZ")} CZK
      </div>
    </div>
  );
}

// ---------- GOAL ROW ----------

function GoalRow({ goal }: { goal: SavingGoal }) {
  const pct =
    goal.goalAmount === 0
      ? 0
      : Math.min(100, (goal.currentAmount / goal.goalAmount) * 100);

  const pctRounded = Math.round(pct);

  const { Icon, barColor, iconColor } = goalIconConfig[goal.id];

  return (
    <div className="rounded-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 md:min-w-[260px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#031b34]">
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{goal.name}</div>
            <div className="text-sm text-[#0b5cf5]">
              Goal: {goal.goalAmount.toLocaleString("cs-CZ")} CZK
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-xl">
          <div className="flex justify-between text-[11px] font-normal">
            <span className="text-[#0b5cf5]">
              Goal: {goal.goalAmount.toLocaleString("cs-CZ")} CZK
            </span>
            <span className="text-[#29e37a]">
              {pctRounded}% ~ {goal.currentAmount.toLocaleString("cs-CZ")} CZK
            </span>
          </div>

          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

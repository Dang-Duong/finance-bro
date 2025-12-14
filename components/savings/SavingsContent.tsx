"use client";

import { useState, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Plane,
  CarFront,
  Home,
  GraduationCap,
  Heart,
  Briefcase,
  ShoppingBag,
  PiggyBank,
} from "lucide-react";
import TrashIcon from "@/components/icons/TrashIcon";
import type { SavingGoal, SavingDeposit } from "@/lib/savingsContext";

/* ---------- ICON CONFIGURATION ---------- */

// Default icon set with colors
const defaultIcons: Array<{
  Icon: LucideIcon;
  barColor: string;
  iconColor: string;
}> = [
  { Icon: Landmark, barColor: "#0b5cf5", iconColor: "#1e88ff" },
  { Icon: Plane, barColor: "#2ae349", iconColor: "#25c63f" },
  { Icon: CarFront, barColor: "#9cff3a", iconColor: "#8ae433" },
  { Icon: Home, barColor: "#ff6b6b", iconColor: "#ff5252" },
  { Icon: GraduationCap, barColor: "#4ecdc4", iconColor: "#26a69a" },
  { Icon: Heart, barColor: "#ff9ff3", iconColor: "#f06292" },
  { Icon: Briefcase, barColor: "#ffe66d", iconColor: "#ffd54f" },
  { Icon: ShoppingBag, barColor: "#a78bfa", iconColor: "#9575cd" },
  { Icon: PiggyBank, barColor: "#60a5fa", iconColor: "#42a5f5" },
];

// Get icon config for a goal based on its name
function getGoalIconConfig(goalName: string, index: number) {
  // Use index to determine icon
  const iconIndex = index % defaultIcons.length;
  return defaultIcons[iconIndex];
}

/* ---------- PROPS ---------- */

interface SavingsContentProps {
  goals: SavingGoal[];
  deposits: SavingDeposit[];
  onAddDeposit: () => void;
  onDeleteDeposit: (id: string) => void;
  onAddGoal?: () => void;
  onEditGoal?: (goal: SavingGoal) => void;
  onDeleteGoal?: (id: string) => void;
  isEditMode?: boolean;
}

/* ---------- MAIN ---------- */

export function SavingsContent({
  goals,
  deposits,
  onAddDeposit,
  onDeleteDeposit,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  isEditMode: externalEditMode,
}: SavingsContentProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const editMode = externalEditMode ?? isEditMode;

  const totalGoal = goals.reduce((sum, g) => sum + g.goalAmount, 0);
  const currentSituation = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const sortedDeposits = [...deposits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Create a map of goalId to goal name for deposits
  const goalNameMap = useMemo(() => {
    const map = new Map<string, string>();
    goals.forEach((goal) => {
      // Ensure _id is a string and add it to the map
      const goalId = String(goal._id);
      map.set(goalId, goal.name);
    });
    return map;
  }, [goals]);

  return (
    <div
      className="mx-auto max-w-6xl rounded-3xl px-6 py-8 md:px-10 md:py-10
      bg-white dark:bg-[#041633]
      border border-gray-200 dark:border-transparent"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Savings
        </h1>

        <div className="flex gap-3">
          <button
            onClick={onAddDeposit}
            className="rounded-full bg-[#0b5cf5] px-8 py-2 text-sm font-medium text-white hover:bg-[#0a4cd0]"
          >
            Add Deposit
          </button>

          {onAddGoal && (
            <button
              onClick={onAddGoal}
              className="rounded-full bg-[#0b5cf5] px-8 py-2 text-sm font-medium text-white hover:bg-[#0a4cd0]"
            >
              Add Goal
            </button>
          )}

          {externalEditMode === undefined && (
            <button
              onClick={() => setIsEditMode((p) => !p)}
              className={`rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                editMode
                  ? "bg-gray-200 text-gray-900"
                  : "bg-[#0b5cf5] text-white hover:bg-[#0a4cd0]"
              }`}
            >
              {editMode ? "Done" : "Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1.2fr]">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard label="TOTAL GOAL" value={totalGoal} />
            <SummaryCard
              label="CURRENT SITUATION"
              value={currentSituation}
              variant="accent"
            />
          </div>

          <div className="space-y-6">
            {goals.map((goal, index) => (
              <GoalRow
                key={goal._id}
                goal={goal}
                index={index}
                isEditMode={editMode}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="mb-4 text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            History of deposit
          </h2>
          <div className="mb-4 h-px bg-gray-200 dark:bg-white/20" />

          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {sortedDeposits.map((d) => (
                <tr key={d._id}>
                  <td className="py-3 pr-4 text-gray-700 dark:text-white/80">
                    {new Date(d.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-green-600">
                    {d.amount.toLocaleString("cs-CZ")} CZK
                  </td>
                  <td className="py-3 pr-4 text-gray-700 dark:text-white/80">
                    {goalNameMap.get(String(d.goalId)) || "Unknown Goal"}
                  </td>
                  {editMode && (
                    <td className="text-right">
                      <button
                        onClick={() => onDeleteDeposit(d._id)}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded"
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
                    colSpan={editMode ? 4 : 3}
                    className="py-6 text-center text-gray-500"
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
  );
}

/* ---------- SUMMARY CARD ---------- */

function SummaryCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "accent";
}) {
  const accent = variant === "accent";

  return (
    <div
      className={`rounded-2xl px-8 py-5
        ${
          accent
            ? "bg-emerald-50 dark:bg-[#043552]"
            : "bg-gray-100 dark:bg-[#032447]"
        }
      `}
    >
      <div className="text-xs uppercase text-gray-600 dark:text-white/70">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-semibold ${
          accent
            ? "text-emerald-600 dark:text-[#12e58b]"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value.toLocaleString("cs-CZ")} CZK
      </div>
    </div>
  );
}

/* ---------- GOAL ROW ---------- */

function GoalRow({
  goal,
  index,
  isEditMode,
  onEdit,
  onDelete,
}: {
  goal: SavingGoal;
  index: number;
  isEditMode?: boolean;
  onEdit?: (goal: SavingGoal) => void;
  onDelete?: (id: string) => void;
}) {
  const pct =
    goal.goalAmount === 0
      ? 0
      : Math.min(100, (goal.currentAmount / goal.goalAmount) * 100);

  const { Icon, barColor, iconColor } = getGoalIconConfig(goal.name, index);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-[#031b34] flex items-center justify-center">
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>

        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">
            {goal.name}
          </div>
          <div className="text-sm text-blue-600">
            Goal: {goal.goalAmount.toLocaleString("cs-CZ")} CZK
          </div>
        </div>

        {isEditMode && (onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded"
                aria-label="Edit goal"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(goal._id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                aria-label="Delete goal"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-blue-600">
            Goal: {goal.goalAmount.toLocaleString("cs-CZ")}
          </span>
          <span className="text-green-600">
            {Math.round(pct)}% · {goal.currentAmount.toLocaleString("cs-CZ")}
          </span>
        </div>

        <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </div>
  );
}

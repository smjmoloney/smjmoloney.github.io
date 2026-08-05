import { Minus, Plus } from "lucide-react";

interface SkeinCounterProps {
    onChange: (value: number) => void;
    value: number;
}

export const SkeinCounter = ({ onChange, value }: SkeinCounterProps) => (
    <fieldset>
        <legend className="text-sm text-neutral-700">Full skeins</legend>
        <div className="mt-2 inline-grid grid-cols-[44px_72px_44px] items-center overflow-hidden rounded-sm border border-neutral-200">
            <button
                type="button"
                className="grid size-11 place-items-center hover:bg-neutral-100 disabled:text-neutral-300"
                onClick={() => onChange(Math.max(0, value - 1))}
                disabled={value === 0}
                aria-label="Remove one full skein"
            >
                <Minus size={18} />
            </button>
            <output className="text-center text-sm" aria-live="polite">
                {value}
            </output>
            <button
                type="button"
                className="grid size-11 place-items-center hover:bg-neutral-100"
                onClick={() => onChange(value + 1)}
                aria-label="Add one full skein"
            >
                <Plus size={18} />
            </button>
        </div>
    </fieldset>
);

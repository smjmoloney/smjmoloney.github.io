import type { ScrollMarkerState } from "../threadInventoryTypes";

interface ScrollMarkerProps {
    marker: ScrollMarkerState;
}

export const ScrollMarker = ({ marker }: ScrollMarkerProps) => {
    if (!marker.visible) return null;

    return (
        <div
            className="pointer-events-none fixed right-3 z-30 -translate-y-1/2 rounded-sm border border-neutral-300 bg-white/95 px-2.5 py-1 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur"
            style={{ top: marker.top }}
            aria-hidden="true"
        >
            {marker.label}
        </div>
    );
};

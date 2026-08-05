import { useEffect, useRef, useState } from "react";
import type { InventoryView, ScrollMarkerState } from "../threadInventoryTypes";

const CURRENT_SECTION_OFFSET = 64;
const MINIMUM_SCROLL_THUMB_HEIGHT = 24;

export const useScrollMarker = (
    view: InventoryView,
    groupSignature: string,
) => {
    const catalogueRef = useRef<HTMLElement>(null);
    const [scrollMarker, setScrollMarker] = useState<ScrollMarkerState>({
        label: "",
        top: 0,
        visible: false,
    });

    useEffect(() => {
        let frame = 0;

        const updateScrollMarker = () => {
            const catalogue = catalogueRef.current;
            if (!catalogue || view !== "catalogue") {
                setScrollMarker((marker) => ({ ...marker, visible: false }));
                return;
            }

            const documentHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollRange = Math.max(documentHeight - viewportHeight, 1);
            const thumbHeight = Math.max(
                (viewportHeight * viewportHeight) / documentHeight,
                MINIMUM_SCROLL_THUMB_HEIGHT,
            );
            const thumbTravel = Math.max(viewportHeight - thumbHeight, 0);
            const thumbCenter =
                (window.scrollY / scrollRange) * thumbTravel + thumbHeight / 2;
            const catalogueBounds = catalogue.getBoundingClientRect();
            const sections = Array.from(
                catalogue.querySelectorAll<HTMLElement>(
                    "[data-catalogue-group]",
                ),
            );
            const currentSection = sections.reduce(
                (current, section) =>
                    section.getBoundingClientRect().top <=
                    CURRENT_SECTION_OFFSET
                        ? section
                        : current,
                sections[0],
            );

            setScrollMarker({
                label: currentSection?.dataset.catalogueGroup ?? "",
                top: thumbCenter,
                visible:
                    catalogueBounds.top < viewportHeight &&
                    catalogueBounds.bottom > 0,
            });
        };

        const scheduleUpdate = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(updateScrollMarker);
        };

        scheduleUpdate();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, [groupSignature, view]);

    return { catalogueRef, scrollMarker };
};

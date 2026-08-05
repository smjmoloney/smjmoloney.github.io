// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScrollMarker } from "./useScrollMarker";

const makeBounds = (top: number, bottom: number): DOMRect =>
    ({
        bottom,
        height: bottom - top,
        left: 0,
        right: 300,
        top,
        width: 300,
        x: 0,
        y: top,
        toJSON: () => ({}),
    }) as DOMRect;

describe("useScrollMarker", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("tracks the current group at the scrollbar thumb centre", () => {
        let scheduledUpdate: FrameRequestCallback | undefined;
        vi.stubGlobal(
            "requestAnimationFrame",
            (callback: FrameRequestCallback) => {
                scheduledUpdate = callback;
                return 1;
            },
        );
        vi.stubGlobal("cancelAnimationFrame", vi.fn());
        vi.stubGlobal("innerHeight", 800);
        vi.stubGlobal("scrollY", 400);
        Object.defineProperty(document.documentElement, "scrollHeight", {
            configurable: true,
            value: 1600,
        });

        const catalogue = document.createElement("section");
        const blue = document.createElement("section");
        blue.dataset.catalogueGroup = "Blue";
        blue.getBoundingClientRect = () => makeBounds(-100, 600);
        catalogue.append(blue);
        catalogue.getBoundingClientRect = () => makeBounds(-200, 1000);
        const { result } = renderHook(() =>
            useScrollMarker("catalogue", "blue"),
        );

        result.current.catalogueRef.current = catalogue;
        act(() => scheduledUpdate?.(0));

        expect(result.current.scrollMarker).toEqual({
            label: "Blue",
            top: 400,
            visible: true,
        });
    });
});

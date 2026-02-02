import type { SegmentAddress } from "wme-sdk-typings";
import { getSdk } from "../sdk";

export function getSelectedSegmentId(): number | null {
  const selection = getSdk().Editing.getSelection();
  if (!selection || selection.objectType !== "segment" || selection.ids.length === 0) {
    return null;
  }
  return selection.ids[0] as number;
}

export function getSelectedSegmentAddress(): SegmentAddress | null {
  const segmentId = getSelectedSegmentId();
  if (!segmentId) {
    return null;
  }
  return getSdk().DataModel.Segments.getAddress({ segmentId });
}

export function getStateNameForSelection(): string | null {
  return getSelectedSegmentAddress()?.state?.name ?? null;
}

export function getTopCountryName(): string | null {
  return getSdk().DataModel.Countries.getTopCountry()?.name ?? null;
}

export function getTopStateName(): string | null {
  return getSdk().DataModel.States.getTopState()?.name ?? null;
}

export function getMapCenter4326(): { lat: number; lon: number } {
  const center = getSdk().Map.getMapCenter();
  return {
    lat: Math.round(center.lat * 1000000) / 1000000,
    lon: Math.round(center.lon * 1000000) / 1000000,
  };
}

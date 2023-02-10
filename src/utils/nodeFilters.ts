import { HTMLElementFilter } from "../types";
import { isClosestEntity } from "./isClosestEntity";

export const allFocusable: HTMLElementFilter = element => {
  if (element.tabIndex >= 0 || element.hasAttribute('tabindex')) {
    return NodeFilter.FILTER_ACCEPT;
  }

  return NodeFilter.FILTER_SKIP;
}

export const currentEntityFocusable: (target: HTMLElement) =>  HTMLElementFilter = target => element => {
  if (!isClosestEntity(target, element) || !target.contains(element)) {
    return NodeFilter.FILTER_REJECT;
  }

  return allFocusable(element);
}
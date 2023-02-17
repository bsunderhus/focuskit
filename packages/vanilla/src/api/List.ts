import { entities, directions, events } from "../constants";
import { List as IList, ListOptions, MoveEvent } from "../types";
import { hasParentEntities } from "../utils/hasParentEntities";
import { Entity } from "./Entity";

export class List extends Entity implements IList {
  private _axis: "horizontal" | "vertical" | "both";
  protected _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(element: HTMLElement, options: ListOptions) {
    const { id, axis = "both" } = options;
    super(element, {
      id,
      entity: entities.LIST,
    });

    this.element = element;
    this._axis = axis;
    this.id = id;
    this.element.addEventListener("keydown", this._onKeyDown);
    this._registerKeys();
    this.recalcTabIndexes();
  }

  dispose() {
    super.dispose();
    this.element.removeEventListener("keydown", this._onKeyDown);
  }

  protected _onFocusIn(): void {
    this.active = true;
  }

  protected _onFocusOut(): void {
    this.active = false;
  }

  protected onActiveChange(): void {}

  private _registerKeys() {
    this._keyHandlers["ArrowUp"] = () => this._move(directions.PREV);
    this._keyHandlers["ArrowDown"] = () => this._move(directions.NEXT);
    this._keyHandlers["ArrowLeft"] = () => this._move(directions.PREV);
    this._keyHandlers["ArrowRight"] = () => this._move(directions.NEXT);
    this._keyHandlers["Home"] = () => this._move(directions.FIRST);
    this._keyHandlers["End"] = () => this._move(directions.LAST);

    switch (this._axis) {
      case "horizontal":
        delete this._keyHandlers["ArrowUp"];
        delete this._keyHandlers["ArrowDown"];
        break;
      case "vertical":
        delete this._keyHandlers["ArrowLeft"];
        delete this._keyHandlers["ArrowRight"];
        break;
      default:
    }
  }

  private _move(direction: MoveEvent["direction"]) {
    this.dispatchFocusKitEvent<MoveEvent>({
      type: events.MOVE_EVENT,
      direction,
    });
  }

  protected _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (hasParentEntities(e.target, this.element)) {
      return;
    }

    if (e.key in this._keyHandlers) {
      this._keyHandlers[e.key](e);
      e.preventDefault();
    }
  };
}

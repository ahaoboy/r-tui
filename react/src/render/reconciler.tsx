import createReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import {
  appendChildNode,
  insertBeforeNode,
  removeChildNode,
  setAttribute,
  setLayoutNode,
} from "@r-tui/flex"
import { applyProps } from "@r-tui/flex"
const NO_CONTEXT = {}
import { RenderConfig, RootName, TDom, TFlex, createTDom } from "@r-tui/rflex"

export function createCustomReconciler(flex: TFlex) {
  return createReconciler({
    supportsMutation: true,
    supportsPersistence: false,
    appendChildToContainer(root: TDom, node: TDom) {
      appendChildNode(root, node)
      flex.renderToConsole()
    },
    insertInContainerBefore: insertBeforeNode,
    commitUpdate(node: TDom, props) {
      applyProps(node, props)
      flex.renderToConsole()
    },
    commitTextUpdate(node, _oldText, newText) {
      throw new Error("not support Text Component update")
    },
    commitMount() {},
    removeChildFromContainer(root: TDom, node: TDom) {
      removeChildNode(root, node)
      flex.renderToConsole()
    },
    createInstance: (
      originalType: unknown,
      props: unknown,
      rootContainer: unknown,
      hostContext: unknown,
      internalHandle: any,
    ): unknown => {
      const node = createTDom()
      applyProps(node, props)
      return node
    },
    createTextInstance: (
      text: string,
      rootContainer: unknown,
      hostContext: unknown,
      internalHandle: any,
    ): unknown => {
      throw new Error("not support Text components")
    },
    hideTextInstance(node) {},
    unhideTextInstance(node, text) {},
    hideInstance(node) {},
    unhideInstance(node) {},
    appendInitialChild: (parentInstance: TDom, child: TDom): void => {
      appendChildNode(parentInstance, child)
      flex.renderToConsole()
    },
    appendChild(parentInstance: TDom, child: TDom): void {
      appendChildNode(parentInstance, child)
      flex.renderToConsole()
    },
    insertBefore(parentInstance: TDom, child: TDom, beforeChild: TDom): void {
      insertBeforeNode(parentInstance, child, beforeChild)
      flex.renderToConsole()
    },
    finalizeInitialChildren: (
      instance: unknown,
      type: unknown,
      props: unknown,
      rootContainer: unknown,
      hostContext: unknown,
    ): boolean => {
      return false
    },
    prepareUpdate: (
      instance: unknown,
      type: unknown,
      oldProps: unknown,
      newProps: unknown,
      rootContainer: unknown,
      hostContext: unknown,
    ): unknown => {
      return newProps
    },
    shouldSetTextContent: (type: unknown, props: unknown): boolean => {
      return false
    },
    getRootHostContext: (rootContainer: unknown): unknown => {
      return NO_CONTEXT
    },
    getChildHostContext: (
      parentHostContext: unknown,
      type: unknown,
      rootContainer: unknown,
    ): unknown => {
      return NO_CONTEXT
    },
    getPublicInstance: (instance: unknown): unknown => {
      return instance
    },
    prepareForCommit: (containerInfo: unknown): Record<string, any> | null => {
      return null
    },
    resetTextContent(instance: unknown) {},
    clearContainer: () => {},
    resetAfterCommit: (containerInfo: unknown): void => {},
    preparePortalMount: (containerInfo: unknown): void => {},
    scheduleTimeout: (
      fn: (...args: unknown[]) => unknown,
      delay?: number | undefined,
    ): unknown => {
      return setTimeout(fn, delay)
    },
    cancelTimeout: (id: number) => {
      return clearTimeout(id)
    },
    noTimeout: -1,
    isPrimaryRenderer: true,
    getCurrentEventPriority: (): number => {
      return DefaultEventPriority
    },
    getInstanceFromNode: (node: any): null => {
      return null
    },
    beforeActiveInstanceBlur: (): void => {},
    afterActiveInstanceBlur: (): void => {},
    prepareScopeUpdate: (scopeInstance: any, instance: any): void => {},
    getInstanceFromScope: (scopeInstance: any): unknown => {
      return null
    },
    detachDeletedInstance: (node: TDom): void => {},
    removeChild(parentInstance: TDom, child: TDom) {
      removeChildNode(parentInstance, child)
      flex.renderToConsole()
    },
    supportsHydration: false,
  })
}

export const defaultFPS = 30

export function render(
  reactNode: React.ReactNode,
  config: Partial<RenderConfig> = {},
) {
  const flex = new TFlex(config)

  const reconciler = createCustomReconciler(flex)
  const container = reconciler.createContainer(
    flex.rootNode,
    0,
    null,
    false,
    null,
    "",
    (e) => {
      throw e
    },
    null,
  )
  let lastW = 0
  let lastH = 0
  function renderRootNode() {
    const { width, height } = flex.canvas.shape
    lastW = width
    lastH = height

    setAttribute(flex.rootNode, "id", RootName)
    setAttribute(flex.rootNode, "width", width)
    setAttribute(flex.rootNode, "height", height)
    setAttribute(flex.rootNode, "position", "relative")
    setAttribute(flex.rootNode, "color", undefined)
    setAttribute(flex.rootNode, "backgroundColor", undefined)
    setAttribute(flex.rootNode, "display", "flex")
    setAttribute(flex.rootNode, "padding", 0)
    setAttribute(flex.rootNode, "borderSize", 0)
    setAttribute(flex.rootNode, "x", 0)
    setAttribute(flex.rootNode, "y", 0)
    setAttribute(flex.rootNode, "zIndex", 0)

    setLayoutNode(flex.rootNode, "x", 0)
    setLayoutNode(flex.rootNode, "y", 0)
    setLayoutNode(flex.rootNode, "width", width)
    setLayoutNode(flex.rootNode, "height", height)
    setLayoutNode(flex.rootNode, "padding", 0)
    setLayoutNode(flex.rootNode, "border", 0)

    reconciler.updateContainer(reactNode, container, null, null)

    flex.renderToConsole()
  }

  renderRootNode()
}

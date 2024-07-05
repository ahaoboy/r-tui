import { BaseDom, BaseMouseEvent } from "./dom"
import {
  Rect,
  type Shape,
  assert,
  isPercentage,
  parsePercentage,
} from "@r-tui/share"
import { Len } from "./type"

function hasTLBR<D extends BaseDom>(node: D): boolean {
  for (const name of ["top", "left", "bottom", "right"] as const) {
    if (typeof node.attributes[name] !== "undefined") {
      return true
    }
  }
  return false
}

export function lenToNumber<D extends BaseDom>(
  node: D,
  len: Len | undefined,
  isX: boolean,
  defaultValue = 0,
): number {
  let v = defaultValue
  switch (typeof len) {
    case "number": {
      v = len
      break
    }
    case "undefined": {
      break
    }
    case "string": {
      if (isPercentage(len)) {
        return getAxisSize(node.parentNode!, isX) * parsePercentage(len)
      }
      return Number.parseFloat(len)
    }
    default: {
      throw new Error(`len type error: ${len}`)
    }
  }
  return v
}

function skipFlexLayout<D extends BaseDom>(node: D): boolean {
  return (
    node.attributes.position === "absolute" ||
    hasTLBR(node) ||
    typeof node.attributes.x !== "undefined" ||
    typeof node.attributes.y !== "undefined"
  )
}

const defaultZIndexStep = 1

function getAxisAttrSize<D extends BaseDom>(n: D, isX: boolean) {
  return isX ? n.attributes.width : n.attributes.height
}
function getAxisPosition<D extends BaseDom>(n: D, isX: boolean) {
  return isX ? n.layoutNode.x : n.layoutNode.y
}
function getAxisSize<D extends BaseDom>(n: D, isX: boolean) {
  return isX ? n.layoutNode.width : n.layoutNode.height
}
function setAxisPosition<D extends BaseDom>(n: D, x: number, isX: boolean) {
  if (isX) {
    n.layoutNode.x = x
  } else {
    n.layoutNode.y = x
  }
}
function setAxisSize<D extends BaseDom>(n: D, x: number, isX: boolean) {
  if (isX) {
    n.layoutNode.width = x
  } else {
    n.layoutNode.height = x
  }
}

export abstract class Flex<A extends {}, P extends {}, E extends {} = {}> {
  rootNode: BaseDom<A, P, E>
  abstract customCreateNode(): BaseDom<A, P, E>
  abstract customIsRootNode(node: BaseDom<A, P, E>): boolean
  abstract customCreateRootNode(): BaseDom<A, P, E>
  abstract customRenderNode(
    node: BaseDom<A, P, E>,
    currentRenderCount: number,
    deep: number,
  ): void

  abstract customMeasureNode(node: BaseDom<A, P, E>): Shape
  abstract customComputeZIndex(
    node: BaseDom<A, P, E>,
    zIndex: number,
    currentRenderCount: number,
    deep: number,
  ): void

  // event
  abstract customCreateMouseEvent(
    node: BaseDom<A, P, E> | undefined,
    x: number,
    y: number,
    hover: boolean,
    event: E,
  ): BaseMouseEvent<A, P, E>
  abstract customIsWheelDown(e: BaseMouseEvent<A, P, E>): boolean
  abstract customIsWheelUp(e: BaseMouseEvent<A, P, E>): boolean
  abstract customIsMousePress(e: BaseMouseEvent<A, P, E>): boolean
  abstract customIsMouseDown(e: BaseMouseEvent<A, P, E>): boolean
  abstract customIsMouseUp(e: BaseMouseEvent<A, P, E>): boolean

  constructor() {
    this.rootNode = this.customCreateRootNode()
  }

  private renderCount = 0
  private maxRenderCount = 1 << 10
  rerender() {
    this.renderCount = (this.renderCount + 1) % this.maxRenderCount
    this.renderNode(this.rootNode, this.renderCount, 0)
  }
  private computedNodeTLBR(node: BaseDom<A, P, E>) {
    const { attributes, layoutNode } = node
    let parent = node.parentNode ? node.parentNode : node
    while (parent && parent.attributes.position === "absolute") {
      parent = parent.parentNode!
    }

    // if (attributes.position !== 'absolute') {
    //   layoutNode.x = parent.layoutNode.x
    //   layoutNode.y = parent.layoutNode.y
    //   return
    // }

    assert(
      !(
        typeof attributes.left !== "undefined" &&
        typeof attributes.right !== "undefined"
      ),
      "absolute position: do not set both left and right",
    )

    assert(
      !(
        typeof attributes.top !== "undefined" &&
        typeof attributes.bottom !== "undefined"
      ),
      "absolute position: do not set both top and bottom",
    )

    setAxisPosition(node, parent.layoutNode.x, true)
    setAxisPosition(node, parent.layoutNode.y, false)

    switch (typeof attributes.left) {
      case "number": {
        layoutNode.x = parent.layoutNode.x + attributes.left
        break
      }
      case "undefined": {
        // layoutNode.x = parent.layoutNode.x
        break
      }
      case "string": {
        layoutNode.x =
          parent.layoutNode.x +
          parent.layoutNode.width * parsePercentage(attributes.left)

        break
      }
      default: {
        throw new Error(`left type error: ${attributes.left}`)
      }
    }

    switch (typeof attributes.right) {
      case "number": {
        layoutNode.x =
          parent.layoutNode.x +
          parent.layoutNode.width -
          attributes.right -
          layoutNode.width
        break
      }
      case "string": {
        layoutNode.x =
          parent.layoutNode.x +
          parent.layoutNode.width -
          layoutNode.width -
          parent.layoutNode.width * parsePercentage(attributes.right)
        break
      }
      case "undefined": {
        // layoutNode.x = parent.layoutNode.x
        break
      }
      default: {
        throw new Error(`right type error: ${attributes.right}`)
      }
    }

    switch (typeof attributes.top) {
      case "number": {
        layoutNode.y = parent.layoutNode.y + attributes.top
        break
      }
      case "string": {
        layoutNode.y =
          parent.layoutNode.y +
          parent.layoutNode.height * parsePercentage(attributes.top)
        break
      }
      case "undefined": {
        // layoutNode.y = parent.layoutNode.y
        break
      }

      default: {
        throw new Error(`bottom type top: ${attributes.top}`)
      }
    }

    switch (typeof attributes.bottom) {
      case "number": {
        layoutNode.y =
          parent.layoutNode.y +
          parent.layoutNode.height -
          attributes.bottom -
          layoutNode.height
        break
      }
      case "string": {
        layoutNode.y =
          parent.layoutNode.y +
          parent.layoutNode.height -
          layoutNode.height -
          parent.layoutNode.height * parsePercentage(attributes.bottom)
        break
      }
      case "undefined": {
        // layoutNode.y = parent.layoutNode.y
        break
      }
      default: {
        throw new Error(`bottom type bottom: ${attributes.bottom}`)
      }
    }
  }

  private computeZIndex(node: BaseDom<A, P, E>) {
    const { attributes } = node

    if (typeof attributes.zIndex === "number") {
      return attributes.zIndex
    }
    let parent = node.parentNode

    let deep = 1
    while (parent) {
      if (typeof parent.attributes.zIndex === "undefined") {
        parent = parent.parentNode
        deep += defaultZIndexStep
      }
      if (parent && typeof parent?.attributes?.zIndex === "number") {
        return parent.attributes.zIndex + deep
      }
    }
    return deep
  }
  private computeNodeSize(
    node: BaseDom<A, P, E>,
    currentRenderCount: number,
    deep: number,
  ) {
    const { attributes, layoutNode } = node
    const isX = node.attributes.flexDirection !== "row"

    if (node.layoutNode.computedSizeCount === currentRenderCount) {
      return
    }
    layoutNode.computedSizeCount = currentRenderCount

    // const {
    //   osdOverlays: [textOverlay, bgOverlay, borderOverlay],
    // } = node
    const zIndex = this.computeZIndex(node)
    this.customComputeZIndex(node, zIndex, currentRenderCount, deep)
    // textOverlay.z = zIndex + 3
    // bgOverlay.z = zIndex + 2
    // borderOverlay.z = zIndex + 1

    if (this.customIsRootNode(node)) {
      for (const c of node.childNodes) {
        this.computeNodeSize(c, currentRenderCount, deep + 1)
      }
      return
    }

    const paddingSize = lenToNumber(node, attributes.padding, isX)
    layoutNode.padding = paddingSize
    const borderSize = lenToNumber(node, attributes.borderSize, isX)
    layoutNode.border = borderSize
    const extraSize = paddingSize * 2 + borderSize * 2

    const xAttr = getAxisAttrSize(node, isX)
    const yAttr = getAxisAttrSize(node, !isX)
    const xIsAuto = xAttr === undefined || xAttr === "auto"
    const yIsAuto = yAttr === undefined || yAttr === "auto"

    if (typeof attributes.text === "string") {
      const { width, height } = this.customMeasureNode(node)
      layoutNode.textRect = new Rect(
        layoutNode.textRect.x,
        layoutNode.textRect.y,
        width,
        height,
      )
      if (xIsAuto) {
        layoutNode.width = extraSize + width
      } else {
        layoutNode.width = extraSize + lenToNumber(node, xAttr, true)
      }

      if (yIsAuto) {
        layoutNode.height = extraSize + height
      } else {
        layoutNode.height = extraSize + lenToNumber(node, yAttr, false)
      }

      // The size of the text node is not affected by its child nodes
      // making it convenient for calculating offsets in child nodes.
      for (const c of node.childNodes) {
        this.computeNodeSize(c, currentRenderCount, deep + 1)
      }
      return
    }

    if (xIsAuto || yIsAuto) {
      let maxXAxisLen = 0
      let maxYAxisLen = 0
      let sumXAxisLen = 0
      let sumYAxisLen = 0

      if (!xIsAuto) {
        this.computeNodeSizeAxis(node, xAttr, isX, extraSize)
      }
      if (!yIsAuto) {
        this.computeNodeSizeAxis(node, yAttr, !isX, extraSize)
      }

      for (const c of node.childNodes) {
        this.computeNodeSize(c, currentRenderCount, deep + 1)

        if (c.attributes.position === "absolute") {
          continue
        }

        const childXSize = getAxisSize(c, isX)
        const childYSize = getAxisSize(c, !isX)
        maxXAxisLen = Math.max(maxXAxisLen, childXSize)
        maxYAxisLen = Math.max(maxYAxisLen, childYSize)
        sumXAxisLen += childXSize
        sumYAxisLen += childYSize
      }

      if (xIsAuto) {
        if (isX) {
          setAxisSize(node, sumXAxisLen + extraSize, true)
        } else {
          setAxisSize(node, maxYAxisLen + extraSize, true)
        }
      }
      if (yIsAuto) {
        if (isX) {
          setAxisSize(node, maxYAxisLen + extraSize, false)
        } else {
          setAxisSize(node, sumXAxisLen + extraSize, false)
        }
      }

      if (node.attributes.alignContent === "stretch") {
        for (const c of node.childNodes) {
          if (isX) {
            if (typeof c.attributes.height === "undefined") {
              c.layoutNode.height = node.layoutNode.height - extraSize
            }
          } else {
            if (typeof c.attributes.width === "undefined") {
              c.layoutNode.width = node.layoutNode.width - extraSize
            }
          }
        }
      }
    } else {
      this.computeNodeSizeAxis(node, xAttr, isX, extraSize)
      this.computeNodeSizeAxis(node, yAttr, !isX, extraSize)
      let maxXAxisLen = 0
      let maxYAxisLen = 0

      for (const c of node.childNodes) {
        this.computeNodeSize(c, currentRenderCount, deep + 1)
        const childXSize = getAxisSize(c, isX)
        const childYSize = getAxisSize(c, !isX)
        maxXAxisLen = Math.max(maxXAxisLen, childXSize)
        maxYAxisLen = Math.max(maxYAxisLen, childYSize)
      }

      if (node.attributes.alignContent === "stretch") {
        for (const c of node.childNodes) {
          if (isX) {
            if (typeof c.attributes.height === "undefined") {
              c.layoutNode.height = node.layoutNode.height - extraSize
            }
          } else {
            if (typeof c.attributes.width === "undefined") {
              c.layoutNode.width = node.layoutNode.width - extraSize
            }
          }
        }
      }
    }
  }

  private computeNodeSizeAxis(
    node: BaseDom<A, P, E>,
    v: number | string | undefined,
    isX: boolean,
    extraSize: number,
  ) {
    // const v = getXAttrLen(node, isX)
    if (typeof v === "number") {
      const len = v + extraSize
      setAxisSize(node, len, isX)
      return
    }
    if (typeof v === "string") {
      assert(v.endsWith("%"), "length string must end with %")
      const parentAttrLen = getAxisAttrSize(node.parentNode!, isX)
      assert(
        !(parentAttrLen === "auto" || parentAttrLen === undefined),
        "The parent of a node of relative size cannot be auto or undefined",
      )
      const len = lenToNumber(node, v, isX) + extraSize
      setAxisSize(node, len, isX)
      return
    }
    throw new Error(`computeNodeSize error, not support length: ${v}`)
  }

  private computedNodeAlign(node: BaseDom<A, P, E>) {
    const { attributes } = node
    const isX = attributes.flexDirection !== "row"

    const { justifyContent = "start", alignItems = "start" } = attributes

    const flexNodes = node.childNodes.filter((i) => !skipFlexLayout(i))

    if (justifyContent === "end") {
      flexNodes.reverse()
    }

    const nodeExtraSize = node.layoutNode.padding + node.layoutNode.border
    const nodeXPos = getAxisPosition(node, isX) + nodeExtraSize
    const nodeYPos = getAxisPosition(node, !isX) + nodeExtraSize
    const nodeXSize = getAxisSize(node, isX) - nodeExtraSize * 2
    const nodeYSize = getAxisSize(node, !isX) - nodeExtraSize * 2
    const nodeEndSize = nodeXPos + nodeXSize
    const nodeXEnd = nodeXPos + nodeXSize
    const nodeYEnd = nodeYPos + nodeYSize
    let xAxisStart = 0
    let yAxisStart = 0
    const xAxisSize = 0
    const yAxisSize = 0
    let maxXAxisSize = 0
    let maxYAxisSize = 0
    let sumXAxisSize = 0
    const sumYAxisSize = 0

    switch (justifyContent) {
      case "start": {
        switch (alignItems) {
          case "space-between":
          case "start": {
            xAxisStart = nodeXPos
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              const nextXStart = xAxisStart + childXSize

              if (nextXStart > nodeXEnd) {
                yAxisStart += maxYAxisSize
                setAxisPosition(c, nodeXPos, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart = nodeXPos + childXSize
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart += childXSize
              }
            }
            return
          }
          case "end": {
            xAxisStart = nodeXPos
            yAxisStart = nodeYEnd
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              const nextXStart = xAxisStart + childXSize
              if (nextXStart > nodeXEnd) {
                yAxisStart += maxYAxisSize
                setAxisPosition(c, nodeXPos, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart = nodeXPos + childXSize
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart += childXSize
              }
            }
            return
          }
          case "center": {
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              sumXAxisSize += childXSize
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
            }

            xAxisStart = nodeXPos
            yAxisStart = nodeYPos

            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeEndSize) {
                yAxisStart += maxYAxisSize
                setAxisPosition(c, nodeXPos, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart = nodeXPos + childXSize
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(
                  c,
                  yAxisStart + (nodeYSize - childYSize) / 2,
                  !isX,
                )
                xAxisStart += childXSize
              }
            }
            return
          }
        }
      }
      case "end": {
        switch (alignItems) {
          case "space-between":
          case "start": {
            xAxisStart = nodeXEnd
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)

              const nextXStart = xAxisStart - childXSize

              if (nextXStart < nodeXPos) {
                yAxisStart -= maxYAxisSize
                setAxisPosition(c, nodeXEnd - childXSize, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart -= childXSize
              } else {
                setAxisPosition(c, xAxisStart - childXSize, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart -= childXSize
              }
            }
            return
          }
          case "end": {
            xAxisStart = nodeXEnd
            yAxisStart = nodeYEnd
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)

              const nextXStart = xAxisStart - childXSize

              if (nextXStart < nodeXPos) {
                yAxisStart -= maxYAxisSize
                setAxisPosition(c, nodeXEnd - childXSize, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart -= childXSize
              } else {
                setAxisPosition(c, xAxisStart - childXSize, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart -= childXSize
              }
            }
            return
          }
          case "center": {
            xAxisStart = nodeXEnd
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
            }

            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart - childXSize
              if (nextStart < nodeXPos) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, nextStart, isX)

                setAxisPosition(
                  c,
                  yAxisStart + (maxYAxisSize - childYSize) / 2,
                  !isX,
                )
                xAxisStart -= childXSize
              }
            }
            return
          }
        }
      }
      case "center": {
        switch (alignItems) {
          case "space-between":
          case "start": {
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }
            xAxisStart = nodeXPos + (nodeXSize - sumXAxisSize) / 2
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart += childXSize
              }
            }
            return
          }
          case "end": {
            yAxisStart = nodeYEnd
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }
            xAxisStart = nodeXPos + (nodeXSize - sumXAxisSize) / 2
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart += childXSize
              }
            }
            return
          }
          case "center": {
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }
            xAxisStart = nodeXPos + (nodeXSize - sumXAxisSize) / 2
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)

                setAxisPosition(
                  c,
                  yAxisStart + (nodeYSize - childYSize) / 2,
                  !isX,
                )
                xAxisStart += childXSize
              }
            }
            return
          }
        }
      }
      case "space-between": {
        switch (alignItems) {
          case "space-between":
          case "start": {
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }

            xAxisStart = nodeXPos
            const xGap = (nodeXSize - sumXAxisSize) / (flexNodes.length - 1)

            for (let i = 0; i < flexNodes.length; i++) {
              const c = flexNodes[i]
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart, !isX)
                xAxisStart += childXSize + xGap
              }
            }
            return
          }
          case "end": {
            yAxisStart = nodeYEnd
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }
            xAxisStart = nodeXPos
            const xGap = (nodeXSize - sumXAxisSize) / (flexNodes.length - 1)

            for (let i = 0; i < flexNodes.length; i++) {
              const c = flexNodes[i]
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)
                setAxisPosition(c, yAxisStart - childYSize, !isX)
                xAxisStart += childXSize + xGap
              }
            }
            return
          }
          case "center": {
            yAxisStart = nodeYPos
            for (const c of flexNodes) {
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              maxYAxisSize = Math.max(maxYAxisSize, childYSize)
              maxXAxisSize = Math.max(maxXAxisSize, childXSize)
              sumXAxisSize += childXSize
            }
            xAxisStart = nodeXPos
            const xGap = (nodeXSize - sumXAxisSize) / (flexNodes.length - 1)
            for (let i = 0; i < flexNodes.length; i++) {
              const c = flexNodes[i]
              const childXSize = getAxisSize(c, isX)
              const childYSize = getAxisSize(c, !isX)
              const childXPos = getAxisPosition(c, isX)
              const childYPos = getAxisPosition(c, !isX)

              const nextStart = xAxisStart + childXSize
              if (nextStart > nodeXEnd) {
                // print("warn: not support flex wrap", c.attributes.id)
              } else {
                setAxisPosition(c, xAxisStart, isX)

                setAxisPosition(
                  c,
                  yAxisStart + (nodeYSize - childYSize) / 2,
                  !isX,
                )
                xAxisStart += childXSize + xGap
              }
            }
            return
          }
        }
      }
    }

    throw new Error(`not support flex align: ${justifyContent} ${alignItems}`)
  }
  private computeNodeLayout(
    node: BaseDom<A, P, E>,
    currentRenderCount: number,
  ) {
    const { layoutNode, attributes } = node

    if (layoutNode.computedLayoutCount === currentRenderCount) {
      return
    }
    layoutNode.computedLayoutCount = currentRenderCount

    if (hasTLBR(node)) {
      this.computedNodeTLBR(node)
    }
    if (typeof attributes.x === "number") {
      layoutNode.x = attributes.x
    }
    if (typeof attributes.y === "number") {
      layoutNode.y = attributes.y
    }
    switch (attributes.position) {
      case "relative": {
      }
      case undefined: {
        if (node.childNodes.length && node.attributes.display === "flex") {
          this.computedNodeAlign(node)
        }
        break
      }
      case "absolute": {
        if (node.childNodes.length && node.attributes.display === "flex") {
          this.computedNodeAlign(node)
        }
        break
      }
      default: {
        throw new Error(`error position: ${attributes.position}`)
      }
    }
    for (const i of node.childNodes) {
      this.computeNodeLayout(i, currentRenderCount)
    }
    // node.layoutNode._tlbr = false
    // log("----computeLayout end: ", JSON.stringify(node.layoutNode))
  }

  private computedLayout(node: BaseDom<A, P, E>, currentRenderCount: number) {
    // console.log("computedLayout", node.attributes.text)
    if (node.layoutNode.computedLayoutCount === currentRenderCount) {
      return
    }
    // const st1 = +Date.now()
    this.computeNodeSize(node, currentRenderCount, 0)
    // const st2 = +Date.now()
    this.computeNodeLayout(node, currentRenderCount)
    // // console.log("layout time: ", st2 - st1, st3 - st2)
  }
  renderNode(node: BaseDom<A, P, E>, currentRenderCount: number, deep: number) {
    // console.log("renderNode", node.attributes.text)
    this.computedLayout(this.rootNode, currentRenderCount)
    this.customRenderNode(node, currentRenderCount, deep)

    for (const i of node.childNodes) {
      this.renderNode(i, currentRenderCount, deep + 1)
    }
  }

  dispatchMouseEvent(node: BaseDom<A, P, E>, event: BaseMouseEvent<A, P, E>) {
    if (node.attributes.hide || node.attributes.pointerEvents === "none") {
      return
    }
    for (const c of node.childNodes) {
      this.dispatchMouseEvent(c, event)
    }
    this.dispatchMouseEventForNode(node, event)
  }

  private dispatchMouseEventForNode(
    node: BaseDom<A, P, E>,
    event: BaseMouseEvent<A, P, E>,
  ) {
    if (!event.bubbles) {
      return
    }
    if (node.attributes.pointerEvents === "none") {
      return
    }
    if (node.attributes.hide) {
      return
    }
    const { attributes, layoutNode } = node
    if (node.layoutNode.hasPoint(event.x, event.y)) {
      if (typeof event.target === "undefined") {
        event.target = node
      }

      if (event.hover) {
        if (this.customIsWheelDown(event)) {
          attributes.onWheelDown?.(event)
          return
        }
        if (this.customIsWheelUp(event)) {
          attributes.onWheelUp?.(event)
          return
        }

        if (this.customIsMousePress(event)) {
          if (layoutNode._mouseDown) {
            attributes.onMousePress?.(event)
          } else if (!layoutNode._mouseIn) {
            attributes.onMouseEnter?.(event)
            layoutNode._mouseIn = true
          } else {
            attributes.onMouseMove?.(event)
          }
        } else if (!layoutNode._mouseDown && this.customIsMouseDown(event)) {
          if (!layoutNode._mouseDown) {
            attributes.onMouseDown?.(event)
            attributes.onClick?.(event)
            layoutNode._mouseDown = true
            layoutNode._mouseUp = false
            if (!layoutNode._focus) {
              layoutNode._focus = true
              attributes.onFocus?.(event)
            }
          }
        } else if (this.customIsMouseUp(event)) {
          if (!layoutNode._mouseUp) {
            attributes.onMouseUp?.(event)
            layoutNode._mouseDown = false
            layoutNode._mouseUp = true
            if (!layoutNode._focus) {
              attributes.onFocus?.(event)
              layoutNode._focus = true
            }
          }
        }
      } else if (layoutNode._mouseIn) {
        attributes.onMouseLeave?.(event)
        layoutNode._mouseIn = false
      }
    } else {
      // const mouseEvent = this.customCreateMouseEvent(
      //   node,
      //   event.x,
      //   event.y,
      //   event.hover,
      //   event.event,
      // )

      // mouseEvent.target = undefined
      if (layoutNode._mouseIn) {
        attributes.onMouseLeave?.(event)
        layoutNode._mouseIn = false
        // layoutNode._mouseUp = false
      }

      if (
        layoutNode._focus &&
        (this.customIsMouseDown(event) || this.customIsMouseUp(event))
      ) {
        attributes.onBlur?.(event)
        layoutNode._focus = false
        // layoutNode._mouseIn = false
        // layoutNode._mouseUp = false
      }
    }
  }
}

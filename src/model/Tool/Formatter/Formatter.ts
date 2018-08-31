import Particle from "../../../../../Draw/src/model/Particle"
import Operation from "../../Operation/Operation"
import Getters from "../../../state/Getters"
import Flow from "./Flow"
import {
  notFirst,
  findArrayFirstIndex,
  prevElement,
  lastElement,
  firstElement,
  isFirst
} from "../../../../../Draw/src/util/js/array"
import Chain from "./Chain"
import { RESULT_NODE, FORMATTER_DIRECTION } from "../../../constant/type"
import FlowWithOnlyDataNodesInData from "./FlowWithOnlyDataNodesInData"
import FlowWithResultNodeInData from "./FlowWithResultNodeInData"
import ResultNode from "../../Node/ResultNode/ResultNode"
import Node from "../../Node/Node"
import { notNil, uniqWith, isNil } from "../../../../../Draw/src/util/lodash/index"
import {
  getItemsBounds,
  getBoundsByManyBounds
} from "../../../../../Draw/src/drawUtil/bounds"
import Actions from "../../../state/Actions"
import { isEqualDsElements } from "../../../dsUtil/formatter"
import Store from "../../../state/Store"
import Item from "../../../../../Draw/src/model/Item"
import { VERTICAL, HORIZONTAL } from '../../../constant/name'

const { min, max } = Math

export default class Formatter extends Particle {
  static CHAINS_INTERVAL = 100
  static SINGLE_NODES_INTERVAL = 100

  direction: string = FORMATTER_DIRECTION[ HORIZONTAL ]

  constructor( props ) {
    super( props )
  }

  get flows(): Flow[] {
    const { operationsList } = <Getters>this.getters
    return operationsList.map(
      operation => new Flow( { draw: this.draw }, operation )
    )
  }

  get flowsWithOnlyDataNodesInData(): Flow[] {
    const { operationsList } = <Getters>this.getters
    return operationsList
      .filter( hasOnlyDataNodes )
      .map(
        operation =>
          new FlowWithOnlyDataNodesInData( { draw: this.draw }, operation )
      )

    function hasOnlyDataNodes( { nodes }: Operation ) {
      return nodes.every( node => node.isDataNode )
    }
  }

  get flowsWithResultNodeInData(): Flow[] {
    const { operationsList } = <Getters>this.getters
    return operationsList
      .filter( hasResultNode )
      .map(
        operation =>
          new FlowWithResultNodeInData( { draw: this.draw }, operation )
      )

    function hasResultNode( { nodes }: Operation ) {
      return nodes.some( node => node.isResultNode )
    }
  }

  get chains(): Chain[] {
    const self = this
    let res = []
    const { flowsWithOnlyDataNodesInData, flowsWithResultNodeInData } = this

    flowsWithOnlyDataNodesInData.map( getRes )
    return res

    function getRes( flow: FlowWithOnlyDataNodesInData ) {
      if ( chainsIncludeFlow( res, flow ) ) {
        return
      }

      const { result } = flow

      const hasResult = self.flowsWithResultNodeInDataHasDataElement( result )

      if ( !hasResult ) {
        const flows = [ flow ]
        const chain = new Chain( { draw: self.draw }, flows )
        res.push( chain )
      }

      if ( hasResult ) {
        let flows = getChainFlowsByFlow( flow )

        const chain = new Chain( { draw: self.draw }, flows )
        res.push( chain )
      }

      function getChainFlowsByFlow( flow: Flow ): Flow[] {
        let chainFlows = [ flow ]
        const { data, result } = flow

        // resolveFlowData( data )
        resolveFlowResult( result )

        chainFlows = uniqWith( chainFlows, isEqualDsElements )
        return chainFlows

        function resolveFlowData( data: Node[] ) {
          data
            .filter( node => node.isResultNode )
            .map( resultNode => self.getFlowByResult( <ResultNode>resultNode ) )
            .filter( flow => !chainsIncludeFlow( res, flow ) )
            .map( flow => {
              chainFlows.push( flow )
              const { data } = flow
              resolveFlowData( data )
            } )
        }

        function resolveFlowResult( result: ResultNode ) {
          const flow = flowsWithResultNodeInData.filter( ( { data } ) =>
            data.includes( result )
          )[ 0 ]
          if ( flow && !chainsIncludeFlow( res, flow ) ) {
            chainFlows.push( flow )

            const { data, result } = flow
            resolveFlowData( data )
            resolveFlowResult( result )
          }
        }
      }
    }

    function chainsIncludeFlow( chains: Chain[], flow: Flow ) {
      return chains.some( ( { flows } ) =>
        flows.some( ( theFlow: Flow ) => isEqualDsElements( theFlow, flow ) )
      )
    }
  }

  get sortedChains(): Chain[] {
    const self = this
    const cloneChains = [ ...this.chains ]
    return cloneChains.sort( sortFromTopToBottom )

    function sortFromTopToBottom( a, b ) {
      const topA = a.bounds.top
      const topB = b.bounds.top

      const leftA = a.bounds.left
      const leftB = b.bounds.left

      if ( self.isVertical ) {
        return topA - topB
      }

      if ( self.isHorizontal ) {
        return leftA - leftB
      }
    }
  }

  get firstSortedChain(): Chain {
    return firstElement( this.sortedChains )
  }

  get lastSortedChain(): Chain {
    return lastElement( this.sortedChains )
  }

  get singleNodes(): Node[] {
    const getters = <Getters>this.getters
    return getters.dataNodeList.filter( ( { operation }: Node ) =>
      isNil( operation )
    )
  }

  get sortedSingleNodes(): Node[] {
    const self = this
    const cloneSingleNodes = [ ...this.singleNodes ]
    return cloneSingleNodes.sort( sortFromTopToBottom )

    function sortFromTopToBottom( a, b ) {
      const topA = a.bounds.top
      const topB = b.bounds.top

      const leftA = a.bounds.left
      const leftB = b.bounds.left

      if ( self.isVertical ) {
        return topA - topB
      }

      if ( self.isHorizontal ) {
        return leftA - leftB
      }
    }
  }

  get firstSortedSingleNode(): Node {
    return firstElement( this.sortedSingleNodes )
  }

  get bounds(): Bounds {
    const { sortedSingleNodes, sortedChains } = this
    const sortedSingleNodesBounds = getItemsBounds( sortedSingleNodes )
    const sortedChainsBounds = getItemsBounds( sortedChains )
    return getBoundsByManyBounds( [ sortedSingleNodesBounds, sortedChainsBounds ] )
  }

  get isHorizontal(): boolean {
    return this.direction === FORMATTER_DIRECTION[ HORIZONTAL ]
  }

  get isVertical(): boolean {
    return this.direction === FORMATTER_DIRECTION[ VERTICAL ]
  }

  /**
   * Being used outside
   */
  get finalResultNode(): ResultNode {
    let res = null
    try { res = this.sortedChains[ 0 ].finalResultNode } catch( e ) { }
    this.removeFlowsChains()
    return res
  }

  getFollowingFlowsByResultNode( resultNode: Node ) {
    const self = this
    let flows = []
    try {
      recurToGetResultFlow( resultNode )
      this.removeFlowsChains()
      return flows
    } catch( e ) {}

    return []

    function recurToGetResultFlow( resultNode: Node ) {
      const resultFlow = self.flows.filter( ( { result } ) => result === resultNode )[ 0 ][ 'resultFlow' ]

      if ( resultFlow ) {
        flows.push( resultFlow )
        resultFlow.result && recurToGetResultFlow( resultFlow.result )
      }
    }
  }

  flowsWithResultNodeInDataHasDataElement( node: Node ) {
    const { flowsWithResultNodeInData } = this

    return flowsWithResultNodeInData.some( flow => flow.data.includes( node ) )
  }

  getFlowByResult( result: ResultNode ): Flow {
    return this.flows.filter( ( { result: theResult } ) => theResult === result )[ 0 ]
  }

  getBoundsOfFlowByResult( result: ResultNode ): Bounds {
    const self = this

    /**
     * Flows used to get bounds
     */
    let flows: Flow[] = []

    recurToAddFlow( result )

    const flowsBounds = flows.map( ( { bounds } ) => bounds )
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    left = min( ...flowsBounds.map( ( { left } ) => left ) )
    right = max( ...flowsBounds.map( ( { right } ) => right ) )
    top = min( ...flowsBounds.map( ( { top } ) => top ) )
    bottom = max( ...flowsBounds.map( ( { bottom } ) => bottom ) )

    return { left, right, top, bottom }

    function recurToAddFlow( result: ResultNode ) {
      const flow: Flow = self.getFlowByResult( result )
      flows.push( flow )

      flow.data.map( node => {
        if ( node.isResultNode ) {
          recurToAddFlow( <ResultNode>node )
        }
      } )
    }
  }

  getResultNodeVerticalDistanceToUpperNode(
    lowerNode: ResultNode,
    upperNode: Node,
    data: Node[]
  ) {
    const self = this
    const { DATA_ELEMENT_INTERVAL } = Flow
    const nearestResult: ResultNode = getNearestResult( lowerNode, data )
    if ( nearestResult ) {
      const { y: upperCY } = upperNode.itemCenter

      const uppers =
        upperNode === nearestResult ? [ upperNode ] : [ upperNode, nearestResult ]
      const upperBounds: Bounds = getUpperBounds( uppers )
      const { bottom: upperBottom } = upperBounds

      const { y: lowerCY } = lowerNode.itemCenter
      const lowerBounds = this.getBoundsOfFlowByResult( <ResultNode>lowerNode )
      const { top: lowerTop } = lowerBounds

      const upperHalfHeight = upperNode.height / 2
      const lowerHalfHeight = lowerNode.height / 2

      return (
        upperBottom -
        upperCY -
        upperHalfHeight +
        ( lowerCY - lowerTop - lowerHalfHeight ) +
        DATA_ELEMENT_INTERVAL
      )
    }

    return DATA_ELEMENT_INTERVAL

    function getNearestResult( node: Node, sortedData: Node[] ): ResultNode {
      let res: ResultNode = null
      const limitIndex = findArrayFirstIndex( sortedData, lowerNode )
      notNil( limitIndex ) && sortedData.map( getRes )
      return res

      function getRes( node: Node, index: number ) {
        if ( index < limitIndex && node.isResultNode ) {
          res = <ResultNode>node
        }
      }
    }

    function getUpperBounds( nodes: Node[] ) {
      const nodesBounds: Bounds[] = nodes.map( node => {
        if ( node.isResultNode ) {
          return self.getBoundsOfFlowByResult( <ResultNode>node )
        }
        return node.bounds
      } )
      return getBoundsByManyBounds( nodesBounds )
    }
  }

  removeFlowsChains() {
    const actions = <Actions>this.actions
    actions.REMOVE_ALL_FLOWS()
    actions.REMOVE_ALL_CHAINS()
  }

  format() {
    const actions = <Actions>this.actions
    actions.DESELECT_ALL_CELLS()

    this.foramtFlowsWithOnlyDataNodesInData()
    this.formatFlowsWithResultNodeInData()
    this.formatSortedChainsPosition()
    this.formatSingleNodesPosition()

    this.removeFlowsChains()
  }

  foramtFlowsWithOnlyDataNodesInData() {
    this.flowsWithOnlyDataNodesInData.map( flow => flow.format() )
  }

  formatFlowsWithResultNodeInData() {
    this.flowsWithResultNodeInData.map( flow => flow.format() )
  }

  formatSortedChainsPosition() {
    const self = this
    const { sortedChains, firstSortedChain } = this
    const { CHAINS_INTERVAL } = Formatter
    const { isVertical, isHorizontal } = this

    let deltaY = 0
    let deltaX = 0
    let basicLeftTop: Point2D = {
      x: 0,
      y: 0
    }

    if ( firstSortedChain ) {
      basicLeftTop = firstSortedChain.leftTop
    }

    sortedChains.map( format )


    function format( chain: Chain, index: number, sortedChains: Chain[] ) {
      if ( notFirst( index ) ) {
        const prevChain = prevElement( sortedChains, index )
        const prevWidth = prevChain ? prevChain.width : 0
        const prevHeight = prevChain ? prevChain.height : 0
        deltaX = deltaX + CHAINS_INTERVAL + prevWidth
        deltaY = deltaY + CHAINS_INTERVAL + prevHeight

        const { x, y } = basicLeftTop
        let newLeftTop = basicLeftTop
        if ( isVertical ) {
          newLeftTop = {
            x: x,
            y: y + deltaY
          }
        }
        if ( isHorizontal ) {
          newLeftTop = {
            x: x + deltaX,
            y: y
          }
        }

        chain.translateLeftTopToPoint( newLeftTop )
      }
    }    
  }

  formatSingleNodesPosition() {
    const { isVertical, isHorizontal } = this
    const { sortedSingleNodes, lastSortedChain, firstSortedSingleNode } = this
    const { SINGLE_NODES_INTERVAL } = Formatter

    let basicCenter = {
      x: 0,
      y: 0
    }
    let deltaX = 0
    let deltaY = 0

    if ( lastSortedChain && firstSortedSingleNode ) {
      const { left, bottom, right, top } = lastSortedChain.bounds
      const { width, height } = firstSortedSingleNode
      if ( isVertical ) {
        basicCenter = {
          x: left + width / 2,
          y: bottom + height / 2
        }
      }
      if ( isHorizontal ) {
        basicCenter = {
          x: right + width / 2,
          y: top + height / 2
        }
      }
      
    }

    if ( !lastSortedChain && firstSortedSingleNode ) {
      basicCenter = firstSortedSingleNode.itemCenter
    }

    sortedSingleNodes.map( format )

    function format( node: Node, index: number, sortedSingleNodes: Node[] ) {
      if ( isFirst( index ) && lastSortedChain ) {
        const curHalfWidth = node.width / 2
        const curHalfHeight = node.height / 2
        deltaX = deltaX + SINGLE_NODES_INTERVAL + curHalfWidth
        deltaY = deltaY + SINGLE_NODES_INTERVAL + curHalfHeight
      }
      if ( notFirst( index ) ) {
        const prevNode = prevElement( sortedSingleNodes, index )
        const prevHalfWidth = prevNode ? prevNode.width / 2 : 0
        const prevHalfHeight = prevNode ? prevNode.height / 2 : 0
        const curHalfWidth = node.width / 2
        const curHalfHeight = node.height / 2
        deltaX = deltaX + SINGLE_NODES_INTERVAL + prevHalfWidth + curHalfWidth
        deltaY = deltaY + SINGLE_NODES_INTERVAL + prevHalfHeight + curHalfHeight
      }

      const { x, y } = basicCenter
      let newCenter = basicCenter
      if ( isVertical ) {
        newCenter = {
          x: x,
          y: y + deltaY
        }
      }
      if ( isHorizontal ) {
        newCenter = {
          x: x + deltaX,
          y: y
        }
      }
      node.translateCenterToPoint( newCenter )
    }
  }

  justifyLeftTopPosition() {
    const { left, top } = this.bounds
    const { sortedSingleNodes, sortedChains } = this

    sortedSingleNodes.map( node => node.translate( -left, -top ) )
    sortedChains.map( chain => chain.translate( -left, -top ) )
  }

  updateDirectionHorizontal() {
    this.direction = FORMATTER_DIRECTION[ HORIZONTAL ]
  }
  
  updateDirectionVertical() {
    this.direction = FORMATTER_DIRECTION[ VERTICAL ]  
  }

  /**
   * // Format
   */
  formatHorizontal() {
    this.updateDirectionHorizontal()
    this.format()
  }

  formatVertical() {
    this.updateDirectionVertical()
    this.format()
  }

  centerLayout() {
    this.justifyLeftTopPosition()
    this.getters.viewPort.centerLayout( this.bounds )
    this.removeFlowsChains()
  }

  centerViewport() {
    this.getters.viewPort.centerLayout( this.bounds )
  }
}

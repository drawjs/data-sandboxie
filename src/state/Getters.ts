import Store from "./Store"
import Ds from "../Ds"
import {
  DATA_SANDBOXIE,
  NODE,
  LINK,
  OPERATION,
  NODES_IDS,
  OPERATION_ID
} from "../constant/name"
import { generateId } from "../../../Draw/src/util/index"
import DrawGetters from "../../../Draw/src/store/draw/Getters"
import Node from "../model/Node/Node"
import Cell from "../../../Draw/src/model/Cell"
import { inRegion } from "../../../Draw/src/drawUtil/model/selector/index"
import Operation from "../model/Operation/Operation"
import {
  notNil,
  mapValues,
  isPlainObject
} from "../../../Draw/src/util/lodash/index"
import { getLastIndex, filterNotIn } from "../../../Draw/src/util/js/array"
import {
  OPERATION_LINK,
  RESULT_LINK,
  DATA_NODE,
  RESULT_NODE
} from "../constant/type"
import DataNode from "../model/Node/DataNode/DataNode"
import ResultNode from "../model/Node/ResultNode/ResultNode"
import { EXPORTABLE } from "../../../Draw/src/store/constant/name"
import isBasicJsonDataType from "../../../Draw/src/util/js/isBasicJsonDataType"
import getAdaptedSize from "../../../Draw/src/util/geometry/getAdaptedSize"
import UnionOperation from "../model/Operation/UnionOperation"
import OPERATION_TYPES, { SUBSET, RELATE } from "../constant/OPERATION_TYPES"
import IntersectOperation from "../model/Operation/IntersectOperation"
import FilterOperation from "../model/Operation/FilterOperation"
import IntersectMultiOperation from "../model/Operation/IntersectMultiOperation"
import SubtractOperation from "../model/Operation/SubtractOperation"
import SubtractMultiOperation from "../model/Operation/SubtractMultiOperation"
import IntersectTwoOperation from "../model/Operation/IntersectTwoOperation"
import SubsetOperation from "../model/Operation/SubsetOperation"
import RelateOperation from "../model/Operation/RelateOperation"

export default class Getters extends DrawGetters {
  store: Store

  constructor( store: Store ) {
    super( store )
    this.store = store
  }

  get ds(): Ds {
    return this.store.ds
  }

  /**
   * Ds elements
   */
  get dsElementsList(): any[] {
    return [ ...this.nodesList, ...this.linksList, ...this.operationsList ]
  }
  get dsElementsInSelectorRegion(): any[] {
    return this.dsElementsList.filter( element =>
      inRegion( element, this.selector )
    )
  }

  getTopDsElement( { x, y }: Point2D ): any {
    const elements = this.dsElementsList.filter( element => {
      return element.contain( x, y )
    } )

    return elements[ elements.length - 1 ]
  }

  /**
   * // Node
   */
  get nodesList(): Node[] {
    return this.store.cellList.filter(
      ( { identityClass } ) => identityClass === NODE
    )
  }

  get dataNodeList(): DataNode[] {
    return <DataNode[]>(
      this.nodesList.filter( ( { type }: Node ) => type === DATA_NODE )
    )
  }

  get resultNodeList(): DataNode[] {
    return <DataNode[]>(
      this.nodesList.filter( ( { type }: Node ) => type === RESULT_NODE )
    )
  }

  get nodesInSelectorRegion(): Node[] {
    return this.nodesList.filter( node => inRegion( node, this.selector ) )
  }

  /**
   * // Link
   */
  get linksList(): any[] {
    return this.store.cellList.filter(
      ( { identityClass } ) => identityClass === LINK
    )
  }

  get linksInSelectorRegion(): any[] {
    return this.linksList.filter( link => inRegion( link, this.selector ) )
  }

  /**
   * // Operation
   */
  get operationsList(): Operation[] {
    return this.store.cellList.filter(
      ( { identityClass } ) => identityClass === OPERATION
    )
  }

  get operationsInSelectorRegion(): any[] {
    return this.operationsList.filter( operation =>
      inRegion( operation, this.selector )
    )
  }

  get operationTypesMap(): any {
    const {
      FILTER,
      UNION,
      INTERSECT,
      INTERSECT_MULTI,
      SUBTRACT,
      SUBTRACT_MULTI,
      INTERSECT_TWO,
    } = OPERATION_TYPES

    return {
      [ FILTER ]         : FilterOperation,
      [ UNION ]          : UnionOperation,
      [ INTERSECT ]      : IntersectOperation,
      [ INTERSECT_MULTI ]: IntersectMultiOperation,
      [ SUBTRACT ]       : SubtractOperation,
      [ SUBTRACT_MULTI ] : SubtractMultiOperation,
      [ INTERSECT_TWO ]  : IntersectTwoOperation,
      [ SUBSET ]         : SubsetOperation,
      [ RELATE ]         : RelateOperation,
    }
  }

  /**
   * // Selection
   */
  get selectedDsElements(): Cell[] {
    return this.dsElementsList.filter(
      ( { shouldSelect } ) => shouldSelect === true
    )
  }

  get selectedDsElementsDraggerEnabled(): any[] {
    return this.selectedDsElements.filter(
      ( { dragger } ) => dragger.enable === true
    )
  }

  /**
   * Deal with special ds elements: OperationLink, ResultLink
   */
  get filteredSelectedDsElementsDraggerEnabled(): any[] {
    let res = []
    let nodesAndOperationsOfOperationLinks = []
    let nodesAndOperationsOfResultLinks = []

    const operationLinks = this.selectedDsElementsDraggerEnabled.filter(
      isOperationLink
    )
    const resultLinks = this.selectedDsElementsDraggerEnabled.filter(
      isResultLink
    )

    nodesAndOperationsOfOperationLinks = getNodesAndOperationsOfOperationLinks(
      operationLinks
    )
    nodesAndOperationsOfResultLinks = getNodesAndOperationsOfResultLinks(
      resultLinks
    )

    const nodesAndOperations = [
      ...nodesAndOperationsOfOperationLinks,
      ...nodesAndOperationsOfResultLinks
    ]
    res = this.selectedDsElementsDraggerEnabled
    // .filter( filterNotIn( nodesAndOperations ) )

    return res

    function isOperationLink( { type } ) {
      return type === OPERATION_LINK
    }

    function isResultLink( { type } ) {
      return type === RESULT_LINK
    }

    function getNodesAndOperationsOfOperationLinks( operationLinks: any[] ) {
      let res = []
      operationLinks.map( ( { nodes, operation } ) => {
        res = [ ...res, ...nodes, operation ]
      } )
      return res
    }

    function getNodesAndOperationsOfResultLinks( resultLinks: any[] ) {
      let res = []
      resultLinks.map( ( { resultNode, operation } ) => {
        res = [ ...res, resultNode, operation ]
      } )
      return res
    }
  }

  get selectedSingleNodes(): Node[] {
    return ( <Node[]>this.selectedDsElements ).filter(
      ( { identityClass, isSingleNode } ) =>
        identityClass === NODE && isSingleNode
    )
  }

  get selectedDataNodes(): DataNode[] {
    return ( <DataNode[]>this.selectedDsElements ).filter(
      ( { type } ) => type === DATA_NODE
    )
  }

  get selectedOperations(): Operation[] {
    return ( <Operation[]>this.selectedDsElements ).filter(
      ( { type } ) => type === OPERATION
    )
  }

  get selectedResultNodes(): ResultNode[] {
    return ( <ResultNode[]>this.selectedDsElements ).filter(
      ( { type } ) => type === RESULT_NODE
    )
  }

  get onlySingleNodesSelected(): boolean {
    return ( <Node[]>this.selectedDsElements ).every(
      ( { isSingleNode, identityClass } ) =>
        isSingleNode && identityClass === NODE
    )
  }

  pointOnDeselectedDsElement( point: Point2D ) {
    const element: any = this.getTopDsElement( point )
    return notNil( element ) && element.shouldSelect === false
  }

  pointOnSelectedDsElement( point: Point2D ) {
    const element: any = this.getTopDsElement( point )
    return notNil( element ) && element.shouldSelect === true
  }

  /**
   * // Setting
   */
  get imageUrls() {
    return this.store.setting.imageUrls || {}
  }

  /**
   * // Export
   */
  get exportingDataNodes() {
    const filteredDataNodes = this.dataNodeList
      .filter( node => node[ EXPORTABLE ] )
      .map( node => {
        let res = {}

        mapValues( node, ( value, key ) => {
          if ( isBasicJsonDataType( value ) || isPlainObject( value ) ) {
            res[ key ] = value
          }
        } )

        return res
      } )
    return filteredDataNodes
  }

  get exportingOperations() {
    const filteredOperations = this.operationsList
      .filter( node => node[ EXPORTABLE ] )
      .map( node => {
        let res = {}

        mapValues( node, ( value, key ) => {
          if ( isBasicJsonDataType( value ) || isPlainObject( value ) ) {
            res[ key ] = value
          }

          if ( key === "nodes" ) {
            res[ NODES_IDS ] = value.map( node => node.id )
          }
        } )

        return res
      } )
    return filteredOperations
  }

  get exportingResultNodes() {
    const filteredResultNodes = this.resultNodeList
      .filter( node => node[ EXPORTABLE ] )
      .map( ( node: any ) => {
        let res = {}

        mapValues( node, ( value: any, key ) => {
          if ( isBasicJsonDataType( value ) || isPlainObject( value ) ) {
            res[ key ] = value
          }
          if ( key === "sourceOperation" ) {
            res[ OPERATION_ID ] = value.id
          }
        } )

        return res
      } )

    return filteredResultNodes
  }

  getExportingAbbreviationUrl( width: number = 500, height = 500 ): string {
    let res = null
    try {
      const {
        canvas,
        canvasLeft,
        canvasTop,
        canvasWidth,
        canvasHeight,
        miniMap,
        viewPort
      } = this
      const { formatter } = this.store

      const { shouldRender: cachedShouldRender } = this.miniMap
      const { zoom: cachedZoom, center: cachedCenter } = viewPort
      this.miniMap.enableRender()

      /**
       * Center viewport
       */
      formatter.centerViewport()
      formatter.removeFlowsChains()

      this.ds.render()

      const { viewBox } = miniMap

      const adaptedSize = getAdaptedSize(
        width,
        height,
        canvasWidth,
        canvasHeight
      )
      // const { width: sizedWidth, height: sizedHeight } = adaptedSize
      const { basicWidth: sizedWidth, basicHeight: sizedHeight } = viewBox
      const tmpCanvas = <HTMLCanvasElement>document.createElement( "canvas" )
      tmpCanvas.style.position = "absolute"
      tmpCanvas.style.left = "0px"
      tmpCanvas.style.bottom = "0px"
      document.body.appendChild( tmpCanvas )

      const tmpCtx = tmpCanvas.getContext( "2d" )

      tmpCanvas.setAttribute( "width", `${sizedWidth}` )
      tmpCanvas.setAttribute( "height", `${sizedHeight}` )

      tmpCtx.drawImage(
        canvas,
        viewBox.basicLeft,
        viewBox.basicTop,
        sizedWidth,
        sizedHeight,
        0,
        0,
        sizedWidth,
        sizedHeight
      )

      res = tmpCanvas.toDataURL()

      /* Test with image */
      const testing = false
      if ( testing ) {
        const testImg = document.createElement( "img" )
        testImg.setAttribute( "width", `${sizedWidth}` )
        testImg.setAttribute( "height", `${sizedHeight}` )
        testImg.setAttribute( "src", res )
        testImg.style.position = "absolute"
        testImg.style.left = "0px"
        testImg.style.top = "0px"
        testImg.style.border = "1px solid grey"
        document.body.appendChild( testImg )
      }

      tmpCanvas.remove()

      /**
       * Recover viewport
       */
      viewPort.update( cachedZoom, cachedCenter )

      /**
       * Recover the 'shouldRender' of miniMap
       */
      this.miniMap.shouldRender = cachedShouldRender
      this.ds.render()

      return res
    } catch ( e ) {
      console.log( e )
    }

    return res
  }

  getExportingData(
    abbreviationWidth: number = 500,
    abbreviationHeight: number = 500
  ): ExportingData {
    const { rootId, viewPort } = this.store
    const { zoom, center } = viewPort
    const {
      exportingDataNodes: dataNodes,
      exportingOperations: operations,
      exportingResultNodes: resultNodes
    } = this
    
    const abbreviationUrl = this.getExportingAbbreviationUrl(
      abbreviationWidth,
      abbreviationHeight
    )

    // console.log( abbreviationUrl )
    return {
      rootId,
      dataNodes,
      operations,
      resultNodes,
      zoom,
      center,
      abbreviationUrl
    }
  }
}

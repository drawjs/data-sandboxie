import Store from "./Store"
import Getters from "./Getters"
import DrawActions from "../../../Draw/src/store/draw/actions"
import Node from "../model/Node/Node"
import { notNil } from "../../../Draw/src/util/lodash/index"
import { removeElement, notEmpty } from "../../../Draw/src/util/js/array"
import Formatter from "../model/Tool/Formatter/Formatter"
import { FLOW, CHAIN } from "../constant/type"
import Interaction from "../model/Tool/Interaction/Interaction"
import Ds from "../Ds"
import { EXPORTABLE } from "../../../Draw/src/store/constant/name"
import isBasicJsonDataType from "../../../Draw/src/util/js/isBasicJsonDataType"
import { NODES_IDS, OPERATION_ID } from "../constant/name"
import ResultNode from "../model/Node/ResultNode/ResultNode"
import Operation from "../model/Operation/Operation"
import DataNode from "../model/Node/DataNode/DataNode"
import ViewPort from "../../../Draw/src/model/tool/ViewPort"
import OPERATION_TYPES from "../constant/OPERATION_TYPES"

export default class Actions extends DrawActions {
  store: Store
  getters: Getters

  constructor( store: Store, getters: Getters ) {
    super( store, getters )
    this.store = store
    this.getters = getters
  }

  /**
   * Reset
   */

  RESET() {
    this.getters.dsElementsList.map( element => element.remove() )
    this.REMOVE_ELEMENTS( this.store.cellList )
  }

  /**
   * // Selector
   */
  DESELECT_ALL_CELLS() {
    this.store.cellList.map( this.sharedActions.deselectCell )
  }

  SELECT_NODES_IN_SELECTOR_REGION() {
    const { nodesInSelectorRegion } = this.getters
    nodesInSelectorRegion.map( this.sharedActions.selectCell )
  }

  SELECT_LINKS_IN_SELECTOR_REGION() {
    const { linksInSelectorRegion } = this.getters
    linksInSelectorRegion.map( this.sharedActions.selectCell )
  }

  SELECT_OPERATIONS_IN_SELECTOR_REGION() {
    const { operationsInSelectorRegion } = this.getters
    operationsInSelectorRegion.map( this.sharedActions.selectCell )
  }

  SELECT_TOP_DS_ELEMENT( point: Point2D ) {
    const element = this.getters.getTopDsElement( point )
    notNil( element ) && this.sharedActions.selectCell( element )
  }

  /**
   * // Interaction
   */
  START_DRAG_TOP_DS_ELEMENT( event ) {
    const point: Point2DInitial = this.getters.getInitialPoint( event )
    const element = this.getters.getTopDsElement( point )
    this.sharedActions.startDragCell( element, event )
  }

  START_DRAG_SELECTED_DS_ELEMENTS( event ) {
    this.getters.selectedDsElements.map( element => this.sharedActions.startDragCell( element, event ) )
  }

  DRAGGING_SELECTED_DS_ELEMENTS_DRAGGER_ENABLED( event ) {
    const self = this

    this.getters.selectedDsElementsDraggerEnabled.map( dragging )

    function dragging( cell ) {
      self.sharedActions.draggingCell( cell, event )
    }
  }

  STOP_DRAG_SELECTED_dS_ELEMENTS_DRAGGER_ENABLED( event ) {
    const self = this

    this.getters.selectedDsElementsDraggerEnabled.map( stopDrag )

    function stopDrag( cell ) {
      self.sharedActions.stopDragCell( cell, event )
    }
  }

  CLICK_TOP_DS_ELEMENT( event ) {
    const point: Point2DInitial = this.getters.getInitialPoint( event )
    const element = this.getters.getTopDsElement( point )
    notNil( element ) && this.sharedActions.clickCell( element, event )
  }

  DOUBLE_CLICK_TOP_DS_ELEMENT( event ) {
    const point: Point2DInitial = this.getters.getInitialPoint( event )
    const element = this.getters.getTopDsElement( point )
    notNil( element ) && this.sharedActions.doubleClickCell( element, event )
  }

  HOVER_TOP_DS_ELEMENT( event, interaction: Interaction ) {
    const { prevHovingDsElement } = interaction

    const point: Point2DInitial = this.getters.getInitialPoint( event )
    const element = this.getters.getTopDsElement( point )

    if ( element && element !== prevHovingDsElement ) {
      this.sharedActions.mouseInCell( element, event )
    }

    if ( prevHovingDsElement && element !== prevHovingDsElement ) {
      this.sharedActions.mouseOutCell( prevHovingDsElement, event )
    }

    notNil( element ) && this.sharedActions.mouseMoveCell( element, event )

    interaction.updatePrevHovingDsElement( element )
  }

  /**
   * // Formatter
   */
  UPDATE_FORMATTER( formatter: Formatter ) {
    this.store.formatter = formatter
  }
  REMOVE_ALL_FLOWS() {
    const flows = this.store.cellList.filter( ( { type } ) => type === FLOW )
    this.REMOVE_ELEMENTS( flows )
  }
  REMOVE_ALL_CHAINS() {
    const chains = this.store.cellList.filter( ( { type } ) => type === CHAIN )
    this.REMOVE_ELEMENTS( chains )
  }

  REMOVE_RESULT_NODE_AND_ITS_FOLLOWING_FLOWS( resultNode: ResultNode ) {
    const followingFlows = this.store.formatter.getFollowingFlowsByResultNode( resultNode )

    console.log( "followingFlows", followingFlows )

    this.sharedActions.forceRemoveFlows( followingFlows )

    resultNode && resultNode.forceRemove()
  }

  /**
   * Operation
   */
  GENERATE_OPERATION_WITH_SELECTED_NODES( operationType ) {
    const { onlySingleNodesSelected } = this.getters
    if ( onlySingleNodesSelected ) {
      const { selectedSingleNodes } = this.getters

      if ( notEmpty( selectedSingleNodes ) ) {
        const operation = this.store.ds.createOperation( {
          nodes: selectedSingleNodes,
          operationType
        } )
        return operation
      }
    }
  }

  GENERATE_FILTER_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.FILTER )
  }

  GENERATE_UNION_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.UNION )
  }

  GENERATE_INTERSECT_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.INTERSECT )
  }

  GENERATE_INTERSECT_MUTLTI_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.INTERSECT_MULTI )
  }

  GENERATE_INTERSECT_TWO_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.INTERSECT_TWO )
  }

  GENERATE_SUBTRACT_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.SUBTRACT )
  }

  GENERATE_SUBTRACT_MULTI_OPERATION_WITH_SELECTED_NODES() {
    this.GENERATE_OPERATION_WITH_SELECTED_NODES( OPERATION_TYPES.SUBTRACT_MULTI )
  }

  




  /**
   * Delete
   */
  DELETE_RESULT_NODE( resultNode: ResultNode ) {
    this.REMOVE_RESULT_NODE_AND_ITS_FOLLOWING_FLOWS( resultNode )
  }

  DELETE_SELECTED_RESLUT_NODES() {
    const { selectedResultNodes } = this.getters
    selectedResultNodes.map( this.DELETE_RESULT_NODE.bind( this ) )
  }

  DELETE_OPERATION( operation: Operation ) {
    const { resultNode } = operation

    notNil( resultNode ) && this.DELETE_RESULT_NODE( resultNode )

    operation && operation.remove()
  }

  DELETE_SELECTED_OPERATIONS() {
    const { selectedOperations } = this.getters
    selectedOperations.map( this.DELETE_OPERATION.bind( this ) )
  }

  DELETE_DATA_NODE( dataNode: DataNode ) {
    const { operation } = dataNode
    notNil( operation ) && this.DELETE_OPERATION( operation )

    dataNode && dataNode.remove()
  }

  DELETE_SELECTED_DATA_NODES() {
    const { selectedDataNodes } = this.getters
    selectedDataNodes.map( this.DELETE_DATA_NODE.bind( this ) )
  }

  DELETE_SELECTED_DS_ELEMENTS() {
    this.DELETE_SELECTED_RESLUT_NODES()
    this.DELETE_SELECTED_OPERATIONS()
    this.DELETE_SELECTED_DATA_NODES()
  }

  /**
   * Setting
   */
  UPDATE_SETTING( setting: DsSetting ) {
    this.store.setting = setting
  }
}

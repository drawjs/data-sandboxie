import Store from "./state/Store"
import Getters from "./state/Getters"
import Actions from "./state/Actions"
import Draw from "../../Draw/src/Draw"
import DataNode from "./model/Node/DataNode/DataNode"
import renderBackground from "../../Draw/src/util/canvas/renderBackground"
import ResultNode from "./model/Node/ResultNode/ResultNode"
import Node from "./model/Node/Node"
import IntersectOperation from "./model/Operation/IntersectOperation"
import DrawStore from "../../Draw/src/store/draw/DrawStore"
import Interaction from "./model/Tool/Interaction/Interaction"
import Formatter from "./model/Tool/Formatter/Formatter"
import { BACKGROUND_COLOR } from "./constant/color"
import Operation from "./model/Operation/Operation"
import { EXPORTABLE } from "../../Draw/src/store/constant/name"
import { getDefaultDrawExportFileName } from "../../Draw/src/store/index"
import * as download from "../../Draw/src/lib/download"
import { NODES_IDS, OPERATION_ID } from "./constant/name"
import { notNil, mapValues } from "../../Draw/src/util/lodash/index"
import imageUrls from "./store/imageUrls"
import UnionOperation from "./model/Operation/UnionOperation"
import OPERATION_TYPES from "./constant/OPERATION_TYPES"

export default class Ds extends Draw {
  store: Store
  getters: Getters
  actions: Actions

  constructor( canvas: HTMLCanvasElement, setting: Setting ) {
    super( canvas, true )

    this.drawStore = new Store( this )
    this.store = <Store>this.drawStore
    this.getters = new Getters( this.store )
    this.actions = new Actions( this.store, this.getters )

    try {
      if ( setting ) {
        this.actions.UPDATE_SETTING( setting )
        mapValues( setting.imageUrls, ( value, key ) => ( imageUrls[ key ] = value ) )
      }
    } catch ( e ) {
      console.log( e )
    }

    this.actions.UPDATE_CANVAS( canvas )
    this._initialize()

    const interaction = new Interaction( { draw: this } )
    this.actions.UPDATE_INTERACTION( interaction )

    this.getters.miniMap.disableRender()
    this.getters.miniMap.enablePreventDefaultCellsRenderInMiniMap()

    const formatter = new Formatter( { draw: this } )
    this.actions.UPDATE_FORMATTER( formatter )
  }

  // renderBackground() {
  //   renderBackground( this.getters.canvas, BACKGROUND_COLOR )
  // }

  createDataNode( props: {} = {} ) {
    const instance = new DataNode( { ...props, draw: this } )
    instance[ EXPORTABLE ] = true

    return instance
  }

  createResultNode( props = {} ) {
    const instance = new ResultNode( { ...props, draw: this } )

    instance[ EXPORTABLE ] = true

    return instance
  }

  createResultNodeByOperation( operation: Operation, props = {} ) {
    const instance = operation.regenerateResultNode( props )
    if ( instance ) {
      instance[ EXPORTABLE ] = true
    }
    return instance
  }

  createOperation( props: any = {} ) {
    const { nodes = [], operationType } = props
    const { operationTypesMap } = this.getters
    const operationClass = operationTypesMap[ operationType ]
    const instance = new operationClass( { ...props, draw: this, nodes } )

    if ( instance ) {
      instance[ EXPORTABLE ] = true
    }
    return instance
  }  

  importData( dataString ) {
    const self = this
    this.actions.RESET()
    this.render()
    const data = JSON.parse( dataString )

    const { rootId, dataNodes, operations, resultNodes, zoom, center } = data

    if (
      notNil( rootId ) &&
      notNil( dataNodes ) &&
      notNil( operations ) &&
      notNil( resultNodes )
    ) {
      this.actions.UPDATE_DRAW_ROOT_ID( rootId )

      // console.log( data )

      /**
       * 1. Create data nodes and result nodes
       */
      dataNodes.map( dataNode => this.createDataNode( dataNode ) )
      resultNodes.map( resultNode => this.createResultNode( resultNode ) )

      /**
       * 2. Create operations
       */
      operations.map( ( operationNode: any = {} ) => {
        const { [ NODES_IDS ]: nodesIds = [] } = operationNode
        // Keep the same order of nodes
        const nodes = nodesIds
          .map( nodeId => {
            try {
              return this.getters.nodesList.filter( ( { id } ) => id === nodeId )[ 0 ]
            } catch ( e ) {
              return null
            }
          } )
          .filter( notNil )

        this.createOperation( {
          ...operationNode,
          nodes
        } )
      } )

      /**
       * 3. Create result nodes(connect operations to result nodes that have been created)
       */
      resultNodes.map( resultNode => {
        const { [ OPERATION_ID ]: operationId, id: resultNodeId } = resultNode
        const operation = <Operation>(
          this.getters.operationsList.filter( ( { id } ) => id === operationId )[ 0 ]
        )
        const dsResultNode = this.getters.resultNodeList.filter(
          ( { id } ) => id === resultNodeId
        )[ 0 ]
        if ( notNil( operation ) && notNil( dsResultNode ) ) {
          operation.connectToResultNode( dsResultNode )
        }
      } )

      /**
       * 4. Recover viewport
       */
      if ( notNil( zoom ) && notNil( center ) ) {
        // this.store.viewPort.zoomTo( zoom )

        // const { x, y } = center
        // const { x: cx, y: cy } = this.store.viewPort.center
        // const dx = x - cx
        // const dy = y - cy
        // this.store.viewPort.panBy( dx, dy )
        this.store.viewPort.update( zoom, center )
      }

      this.render()
    }
  }

  getExportingData( ...props ) {
    return this.getters.getExportingData( ...props )
  }

  exportData( fileName: string = getDefaultDrawExportFileName() ) {
    const data = this.getExportingData()
    const dataString = JSON.stringify( data )
    download( dataString, `${fileName}.json` )
  }
}

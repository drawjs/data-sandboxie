import Flow from '../model/Tool/Formatter/Flow'
import Node from '../model/Node/Node'

export function isEqualDsElements( flow1: Flow, flow2: Flow ): boolean {
  try {
    const ids1 = flow1.dsElements.map( ( { id } ) => id )
    const ids2 = flow2.dsElements.map( ( { id } ) => id )
    return ids1.length === ids2.length && ids1.every( ( id1, index: number ) => id1 === ids2[ index ] )
  } catch( e ) {}
  return false
}

export function getDistanceFromNodesBoundsToOperationCenter( nodes: Node[] ): number {

  const firstNode = nodes[ 0 ]
    if ( firstNode ) {
      const { right } = firstNode.bounds
      return right + Flow.DATA_TO_OPERATION_CENTER
    }
    return null
}
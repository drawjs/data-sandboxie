import Flow from './Flow';
import Operation from '../../Operation/Operation';

export default class FlowWithOnlyDataNodesInData extends Flow {
  constructor( props, operation: Operation ) {
    super( props, operation )
  }
}
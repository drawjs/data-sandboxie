import Line from "../../../../../Draw/src/model/shape/Line";
import Operation from '../../Operation/Operation';
import ResultNode from '../../Node/ResultNode/ResultNode';
import { LINK } from '../../../constant/name';
import { notNil } from "../../../../../Draw/src/util/lodash/index";
import { RESULT_LINK } from '../../../constant/type';
import { LINE_COLOR } from '../../../constant/color';

export default class ResultLink extends Line {
  type: string = RESULT_LINK


  operation: Operation = null
  resultNode: ResultNode = null
  
  renderFnInMiniMap: Function = () => {
		const { ctx } = this.getters
		ctx.lineWidth = 5
		ctx.fillStyle = "#2aaffa"
		ctx.strokeStyle = "#2aaffa"
    this.hitRegionPath2d && ctx.fill( this.hitRegionPath2d )
    this.hitRegionPath2d && ctx.stroke( this.hitRegionPath2d )
  }
  
  constructor( props ) {
    super( setPropsDangerously( props ) )    

    this.operation = notNil( props.operation ) ? props.operation : this.operation
    this.resultNode = notNil( props.resultNode ) ? props.resultNode : this.resultNode


    function setPropsDangerously( props ) {
      const { operation, resultNode }: { operation: Operation, resultNode: ResultNode } = props

      props.sourceSegment = operation.rightLinking
      props.targetSegment = resultNode.leftLinking
      props.showArrow = false
      props.shouldRenderInMiniMap = true
      props.fillColor = LINE_COLOR
      props.addedToBottom = true
      props.getErasingPath2d = () => resultNode.path2d


      // props.draggable = false
      return props
    }
  }

  get identityClass(): string {
    return LINK
  }

  updateDrag( event, dragger ) {
    // if ( this.draggable ) {
    //   const point: Point2DInitial = this.getters.getInitialPoint( event )

    //   const dx = dragger.getDeltaXToPrevPoint( point )
    //   const dy = dragger.getDeltaYToPrevPoint( point )

    //   this.operation.translate( dx, dy )
    //   this.resultNode.translate( dx, dy )
    // }
  }

  select() {
    super.select()
    this.operation && this.operation.select()
    this.resultNode && this.resultNode.select()
  }
}
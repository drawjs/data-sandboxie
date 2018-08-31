import Node from "../Node"
import DrawText from "../../../../../Draw/src/model/text/DrawText"
import DrawImage from "../../../../../Draw/src/model/image/DrawImage"
import LeftLinking from "../../Linking/LeftLinking"
import Flow from "../../Tool/Formatter/Flow"
import { RESULT_NODE } from "../../../constant/type"
import STATUS_URLS_MAP from "../../../constant/STATUS_URLS_MAP"
import { TASK_STATUS } from "../../../constant/resultNodeStatus"
import { notNil, isNil } from "../../../../../Draw/src/util/lodash/index"
import Operation from "../../Operation/Operation"
import Getters from "../../../state/Getters"
import ResultLink from "../../Link/ResultLink/ResultLink"
import imageUrls from "../../../store/imageUrls"



const STATE_ICON_SIZE = 22

export default class ResultNode extends Node {
  type: string = RESULT_NODE

  sourceOperation: any

  infoText: DrawText

  stateIconSrc: string = STATUS_URLS_MAP[ TASK_STATUS.WAITING ]()

  stateIcon: DrawImage

  leftLinking: LeftLinking
  

  static MARGIN = Flow.OPERATION_CENTER_TO_RESULT

  static INFO_TEXT_MARGIN_TOP = 4

  renderFnInMiniMap: Function = () => {
    const { ctx } = this.getters
    ctx.fillStyle = "#007ee4"
    this.path2d && ctx.fill( this.path2d )
  }

  constructor( props ) {
    super( setPropsDangerously( props ) )

    this.sourceOperation = notNil( props.sourceOperation ) ? props.sourceOperation : this.sourceOperation

    const { INFO_TEXT_MARGIN_TOP } = ResultNode
    const { TITLE_TEXT_COLOR, TITLE_TEXT_MARGIN_TOP } = Node
    const { DEFAULT_FONT_SIZE } = DrawText

    const { x: cx } = this.segmentsCenter
    const { left, stateIconSrc } = this
    const { bottom, right, top } = this.bounds

    this.infoText = new DrawText( {
      draw     : this.draw,
      draggable: false,
      x        : cx,
      y        :
        bottom +
        TITLE_TEXT_MARGIN_TOP +
        DEFAULT_FONT_SIZE +
        INFO_TEXT_MARGIN_TOP / 2 +
        INFO_TEXT_MARGIN_TOP,
      text     : "",
      fillColor: TITLE_TEXT_COLOR
    } )

    this.stateIcon = new DrawImage( {
      draw     : this.draw,
      draggable: false,
      src      : stateIconSrc,
      show     : false,
      width    : STATE_ICON_SIZE,
    } )

    this.leftLinking = new LeftLinking( { draw: this.draw, path: this } )

    this.bindDrag()

    this.image.interfaceOnImageLoaded = () => {
      const { top: imageTop, right: imageRight } = this.image.bounds

      this.stateIcon.updateLeft( imageRight - STATE_ICON_SIZE / 2 )
      this.stateIcon.updateTop( imageTop - STATE_ICON_SIZE / 2 )
      this.stateIcon.show = true
    }

    const { status, name } = this.data
    notNil( status ) && this.updateDataStatus( status )

    isNil( name ) && this.titleText.updateText( 'Result Node' )

    function setPropsDangerously( props ) {
      props.src =  imageUrls.FILE_RESULT_SET_TEMPORARY

      return props
    }
  }

  get sourceResultLink(): ResultLink {
    return this.sourceOperation.resultLink
  }

  setSourceOperation( sourceOperation: any ) {
    this.sourceOperation = sourceOperation
  }

  bindDrag() {
    super.bindDrag()

    this.infoText.dragger.interfaceDragging = this.updateDrag.bind( this )

    this.stateIcon.dragger.interfaceDragging = this.updateDrag.bind( this )

    this.leftLinking.dragger.interfaceDragging = this.updateDrag.bind( this )
  }

  translate( dx: number, dy: number ) {
    super.translate( dx, dy )
    this.infoText.translate( dx, dy )

    this.stateIcon.translate( dx, dy )

    this.leftLinking.translate( dx, dy )
  }

  select() {
    this.leftLinking.select()
    super.select()
  }

  updateDataStatus( status ) {
    const stateIconSrc = STATUS_URLS_MAP[ status ]()
    this.stateIconSrc = stateIconSrc
    this.stateIcon.udpateSrc( stateIconSrc )
  }

  remove() {
    this.infoText && this.infoText.remove()
    this.stateIcon && this.stateIcon.remove()
    this.leftLinking && this.leftLinking.remove()
    super.remove()
  }

  forceRemove() {
    this.sourceResultLink && this.sourceResultLink.remove()
    this.remove()
  }
}

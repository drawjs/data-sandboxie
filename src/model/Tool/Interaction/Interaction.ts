import Particle from "../../../../../Draw/src/model/Particle"
import DrawInteraction from "../../../../../Draw/src/core/interaction"
import EventKeyboard from "../../../../../Draw/src/util/EventKeyboard"
import { notNil } from "../../../../../Draw/src/util/lodash/index"
import Ds from "../../../Ds"
import { isMiddleClick } from "../../../../../Draw/src/drawUtil/model/interaction/index"

export default class Interaction extends DrawInteraction {
  eventKeyboard: EventKeyboard


  constructor( props ) {
    super( props )
  }

  mousedownListener( event ) {
    const { getters, actions } = <Ds>this.draw

    const point: Point2DInitial = getters.getInitialPoint( event )

    if ( this.eventKeyboard.isSpacePressing || isMiddleClick( event ) ) {
      getters.viewPort.startPan( event )
      return render()
    }

    if ( getters.pointOnEmpty( point ) ) {
      actions.DESELECT_ALL_CELLS()

      this.interfaceOnEmptyClick && this.interfaceOnEmptyClick( event )

      this.startSelect( event )

      return render()
    }

    if ( getters.pointOnDeselectedDsElement( point ) ) {
      actions.DESELECT_ALL_CELLS()
      actions.SELECT_TOP_DS_ELEMENT( point )
      actions.START_DRAG_SELECTED_DS_ELEMENTS( event )
      return render()
    }

    if ( getters.pointOnSelectedDsElement( point ) ) {
      actions.START_DRAG_SELECTED_DS_ELEMENTS( event )
      return render()
    }

    function render() {
			getters.draw.render()
		}

  }

  mousemoveListener( event ) {
    const { getters, actions } = <Ds>this.draw

    !getters.viewPort.shouldPan &&
      getters.selector.shouldSelect &&
      this.selecting( event )

    getters.viewPort.shouldPan && getters.viewPort.panning( event )

    actions.DRAGGING_SELECTED_DS_ELEMENTS_DRAGGER_ENABLED( event )



    actions.HOVER_TOP_DS_ELEMENT( event, this )

    getters.draw.render()
  }

  mouseupListener( event ) {
		const { getters, actions } = <Ds>this.draw

		getters.selector.shouldSelect = false

      this.stopSelect( event )

      actions.STOP_DRAG_SELECTED_dS_ELEMENTS_DRAGGER_ENABLED( event )

      getters.viewPort.stopPan()

      getters.draw.render()
  }
  
  clickListener( event ) {
    const { actions } = <Ds>this.draw
    
    actions.CLICK_TOP_DS_ELEMENT( event )
  }

  dblclickListener( event ) {
    const { actions } = <Ds>this.draw
		actions.DOUBLE_CLICK_TOP_DS_ELEMENT( event )
	}


  stopSelect( event ) {
    const { getters, actions } = <Ds>this.draw    
    
    actions.SELECT_NODES_IN_SELECTOR_REGION()
    actions.SELECT_LINKS_IN_SELECTOR_REGION()
    actions.SELECT_OPERATIONS_IN_SELECTOR_REGION()

    getters.selector.startPoint = null
    getters.selector.endPoint = null
  }
}


<template>
  <div class="container">
    <canvas ref="canvas" id="canvas"></canvas>

    <TheToolbar >

    
  </TheToolbar>

  <section class="zoomButtonContainer"> 
    <button class="zoomButton" id="zoomIn" @click="onZoomInClick">+</button>
  <button class="zoomButton" id="zoomOut" @click="onZoomOutClick" >-</button>
  </section>

  <TheDataNodePanel v-show="panelType === panelTypes.dataNode" :dataNodeInfo="dataNodeInfo"/>
  <TheOperationPanel v-show="panelType === panelTypes.operation" :operationInfo="operationInfo" :onGenerateResultClick="onGenerateResultClick" />
  <TheResultNodePanel v-show="panelType === panelTypes.resultNode" :resultNodeInfo="resultNodeInfo" />
  </div>
</template>

<script>
import TheToolbar from './TheToolbar/TheToolbar'
import TheDataNodePanel from './TheDataNodePanel.vue'
import TheOperationPanel from './TheOperationPanel.vue'
import TheResultNodePanel from './TheResultNodePanel.vue'
import testImportingData from '../constants/testImportingData'
const { default: Ds } = require('../../../build/ds')
import * as imageUrls from '../constants/imageUrls'
import DsModel from '../model/DsModel'

const sandboxieImageUrlMap = {
  "1"  : "assets/svg/file_xlsx.svg",
  "2"  : "assets/svg/file_csv.svg",
  "3"  : "assets/svg/file_data-base.svg",
  "4"  : "assets/svg/file_custom-group.svg",
  "5"  : "assets/svg/file_asterisk.svg",
  "10" : "assets/svg/file_result-set_perpetual.svg",
  "231": "assets/svg/file_human.svg",
  "235": "assets/svg/file_phone.svg",
  "239": "assets/svg/file_vehicle.svg"
  }




const nodeNormalTableData = {
  sourceDataInfoVO: {
    dbId: 5,
    tableEname: "20000data2",
    tableCname: "20000data2",
    sourceDataType: 1
  },
  count: 20000,
  name: "Data Node",
  src: sandboxieImageUrlMap['1']
};

const nodeGroupTableData = {
  favoriteGroupVO: {
    groupId: "1",
    name: "XX案件",
    categories: [],
    createBy: "1",
    categoryId: "231",
    sourceDataType: 4
  },
  count: 2,
  name: "Test Node2",
  src: sandboxieImageUrlMap['3']
};

const nodeResultData = {
  sourceDataInfoVO: {
    dbId: 5,
    tableEname: "20000data2",
    tableCname: "20000data2",
    sourceDataType: 10
  },
  count: 20000,
  name: "结果1",
  status: 0
};

export default {
  name: "TheDsTest",
  components: {
    TheDataNodePanel,
    TheOperationPanel,
    TheResultNodePanel,
    TheToolbar
  },
  data() {
    return {
      ds: null,
      panelType: null,
      panelTypes: {
        dataNode: 'dataNode',
        operation: 'operation',
        resultNode: 'resultNode',
      },
      dataNodeInfo: {},
      operationInfo: {},
      resultNodeInfo: {}
    }
  },
  provide() {
    this.dsModelMap = { value: new DsModel() }
    const { dsModelMap } = this
    return {
      dsModelMap
    }
  },
  computed: {
    dsModel() {
      return this.dsModelMap.value
    },
    formatter() {
      return this.ds.store.formatter
    }
  },
  mounted() {
    const self = this
    const canvas = this.$refs.canvas
    const { width, height } = document.body.getBoundingClientRect()
    canvas.width = width
    canvas.height = height
    this.ds = new Ds(canvas, {
      imageUrls
    })

    const { ds } = this

    this.dsModel.mutations.UPDATE_DS( ds )
    
    ds.store.interaction.interfaceOnEmptyClick = this.onEmptyClick.bind( this )

    const cachedCreateDataNode = ds.createDataNode
    ds.createDataNode = ( ...props ) => {
      const dataNode = cachedCreateDataNode.bind(ds)( ...props )
      dataNode.handleClick = () => self.onDataNodesClick( dataNode )
      dataNode.handleDoubleClick = () => self.onDataNodesDoubleClick( dataNode )
      return dataNode
    }

    const cachedCreateIntersectOperation = ds.createOperation
    ds.createOperation = ( ...props ) => {
      const operation = cachedCreateIntersectOperation.bind(ds)( ...props )
      operation.handleClick = () => self.onOperationsClick( operation )
      return operation
    }

    const cachedCreateResultNode = ds.createResultNode
    ds.createResultNode = ( ...props ) => {
      const resultNode = cachedCreateResultNode.bind(ds)( ...props )
      if ( resultNode ) {
        resultNode.handleClick = () => self.onResultNodesClick( resultNode )
      }
      return resultNode
    }

    const cachedCreateResultNodeByOperation = ds.createResultNodeByOperation
    ds.createResultNodeByOperation = ( ...props ) => {
      const resultNode = cachedCreateResultNodeByOperation.bind(ds)( ...props )
      if ( resultNode ) {
        resultNode.handleClick = () => self.onResultNodesClick( resultNode )
      }
      return resultNode
    }
   

    dragToGenerateDataNode(document.getElementById("sourceDataNode"), e => {
      let { x, y } = e
      const { canvasLeft, canvasTop } = ds.getters
      x = x - canvasLeft
      y = y - canvasTop
      const initialPoint = ds.getters.viewPort.transformToInitial({
        x,
        y
      })
      const data = ds.createDataNode({
        ...initialPoint,
      })
      ds.render()
    }, ds)

    create(this.ds)
    ds.render()


    // ds.importData( testImportingData )
  },
  methods: {
    onEmptyClick() {
      this.closePanel()
    },
    onDataNodesClick( dataNode ){
      // this.UPDATE_DATA_NODE_INFO( dataNode )
      // this.openDataNodePanel()
    },
    onDataNodesDoubleClick( dataNode ) {
    },
    onOperationsClick( operation ){
      // this.UPDATE_OPERATION_INFO( operation )
      // this.openOperationPanel()
      this.onGenerateResultClick( operation )
    },
    onResultNodesClick(resultNode){
      // this.UPDATE_RESULT_NODE_INFO(resultNode)
      // this.openResultNodePanel()
    },
    onGenerateResultClick( operation ) {
      this.ds.createResultNodeByOperation( operation )
      this.ds.render()
    },
    closePanel() {
      this.panelType = null
    },
    openDataNodePanel() {
      this.panelType = this.panelTypes.dataNode
    },
    openOperationPanel() {
      this.panelType = this.panelTypes.operation
    },
    openResultNodePanel() {
      this.panelType = this.panelTypes.resultNode
    },
    
    
    onZoomInClick() {
      const { ds } = this
      ds.getters.viewPort.zoomIn()
    },
    onZoomOutClick() {
      const { ds } = this
      ds.getters.viewPort.zoomOut()
    },
    UPDATE_DATA_NODE_INFO( dataNode ) {
      this.dataNodeInfo = dataNode
    },
    UPDATE_OPERATION_INFO( operation ) {
      this.operationInfo = operation
    },
    UPDATE_RESULT_NODE_INFO( resultNode ){
      this.resultNodeInfo = resultNode
    }
  }
}

function create(ds, d = 0) {
  const data1 = ds.createDataNode({
    left: d + 100,
    top: d + 200,
    data: nodeNormalTableData
  })

  const data2 = ds.createDataNode({
    left: d + 100,
    top: d + 400,
    data: nodeNormalTableData
  })

  // const data3 = ds.createDataNode({
  //   left: d + 500,
  //   top: d + 800,
  //   data: nodeNormalTableData
  // })
  // const operation1 = ds.createIntersectOperation({
  //   nodes: [data1, data2, data3]
  // })

  // const resultNode1 = ds.createResultNodeByOperation( operation1, {
  //   data: nodeResultData
  // } )

  // const tmp1 =  ds.createDataNode({
  //   left: d + 800,
  //   top: d + 1000,
  // })

  // const operation2 = ds.createIntersectOperation({
  //   nodes: [tmp1, resultNode1]
  // })

  // const resultNode2 = ds.createResultNode( operation2)



  // // -----------

  // const data4 = ds.createDataNode({
  //   left: d + 100,
  //   top: d + 100
  // })

  // const data5 = ds.createDataNode({
  //   left: d + 100,
  //   top: d + 200
  // })

   
}

function dragToGenerateDataNode(dom, generateFn, ds) {
  let enable = false
  let moved = false
  let prevEvent
  let tmpDom

  document.addEventListener("mousedown", mousedownListener)
  document.addEventListener("mousemove", mousemoveListener)
  document.addEventListener("mouseup", mouseupListener)

  function mousedownListener(e) {
    e.preventDefault()

    if (isTarget(e.target)) {
      enable = true
      const { left, top, width, height } = dom.getBoundingClientRect()

      if (!tmpDom) {
        tmpDom = document.createElement("div")
        tmpDom.style.position = "absolute"
        tmpDom.style.zIndex = "10"
        tmpDom.style.width = `${width}px`
        tmpDom.style.height = `${height}px`
        tmpDom.style.display = "none"
        document.body.appendChild(tmpDom)
      }

      if (tmpDom) {
        let { x, y } = e
        const { canvasLeft, canvasTop } = ds.getters
        x = x - canvasLeft
        y = y - canvasTop

        tmpDom.style.left = `${x - width / 2}px`
        tmpDom.style.top = `${y - height / 2}px`
        tmpDom.style.border = "1px solid grey"
      }

      prevEvent = e
    }
  }

  function mousemoveListener(e) {
    if (enable) {
      const { display } = tmpDom.style
      if (!display || display === "none") {
        tmpDom.style.display = `block`
      }

      const dx = e.x - prevEvent.x
      const dy = e.y - prevEvent.y

      const { left, top } = tmpDom.getBoundingClientRect()

      tmpDom.style.left = `${left + dx}px`
      tmpDom.style.top = `${top + dy}px`

      prevEvent = e
      moved = true
    }
  }

  function mouseupListener(e) {
    if (enable && moved) {
      generateFn && generateFn(e)

      enable = false
      moved = false
      tmpDom.style.display = `none`
    }
  }

  function isTarget(theDom) {
    return theDom === dom
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #1b2430;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  height: 100%;
}


.buttonsContainer {
  position: fixed;
  left: 10px;
  top: 10px;
}

.buttonsContainer button {
  margin: 20px;
}



.zoomButtonContainer {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
}

button.zoomButton {
  width: 34px;
  height: 34px;
  font-size: 24px;
  background: rgba(41, 50, 64, 0.9);
  color: #526375;
  border: none;
  cursor: pointer;
}
button.zoomButton:hover {
  color: #aaa;
}
#zoomIn {
}
#zoomOut {
  margin: 10px 0 0 0;
}
</style>

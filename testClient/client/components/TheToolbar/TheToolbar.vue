<template>
  <section class="TheToolbar">
      <Button  id="button1" @click.native="onButton1Click">Layout</Button>

      <Button :disabled="notOperable"    @click.native="onFilterClick">Filter</Button>
      <Button :disabled="notOperable"   @click.native="onUnionClick">Union</Button>
      <Button :disabled="notOperable"  id="button4"  @click.native="onButton4Click">Intersect</Button>
      <Button :disabled="notOperable"   @click.native="onIntersectMultiClick">Mutiple Intersect</Button>
      <Button :disabled="notOperable"   @click.native="onIntersectTwoClick">Pairwise Intersect</Button>
      <Button :disabled="notOperable"   @click.native="onSubtractClick">Subset</Button>
      <Button :disabled="notOperable"   @click.native="onSubtractMultiClick">Mutiple Exclusions</Button>
      <Button :disabled="notOperable"   @click.native="onSubSetClick">Subset</Button>

      <label class="importInputLabel">
        <input type="file"  class="importInput" name="upload" size="60"  @change="onImportChange">
        Import
      </label>
      <Button  id="exportButton" @click.native="onExportClick">Export</Button>
      <Button  id="delteButton" @click.native="onDeleteClick">Delete</Button>

      <span id="sourceDataNode" >Node (Drag to generate)</span>

      <!-- Hidden when displayed -->
      <section v-show="false">
        <Button  id="testButton" @click.native="onTestClick">Get the ID of Final Result Node</Button>
      </section>
  </section>
</template>

<script>
import Button from './Button'
import { mapState, mapActions } from 'vuex';
export default {
  name: 'TheToolbar',
  components: {
    Button
  },
  inject: ['dsModelMap' ],
  computed: {
    ...mapState( 'app', [ 'operable' ] ),
    notOperable() {
      return !this.operable
    },
    dsModel() {
      return this.dsModelMap.value
    },
    ds() {
      return this.dsModel.store.ds
    },
    formatter() {
      return this.ds.store.formatter
    }
  },
  mounted() {
    const { dsModel } = this
    this.autoUpdateOperable( { dsModel } )
  },
  methods: {
    ...mapActions( 'app', [ 'autoUpdateOperable' ] ),
    onButton1Click() {
      const { ds, formatter } = this
      formatter.format()
      formatter.centerLayout()
      ds.render()
    },
    onButton2Click() {
      const { ds, formatter } = this
      formatter.formatHorizontal()
      ds.render()
    },
    onButton3Click() {
      const { ds, formatter } = this
      formatter.centerViewPort()
      ds.render()
    },
    onCenterViewportClick() {
      const { ds, formatter } = this
      formatter.centerViewport()
      formatter.removeFlowsChains()
      ds.render()
    },
    onFilterClick() {
      const { ds } = this
      ds.actions.GENERATE_FILTER_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onUnionClick() {
      const { ds } = this
      ds.actions.GENERATE_UNION_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onButton4Click() {
      const { ds } = this
      ds.actions.GENERATE_INTERSECT_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onIntersectMultiClick() {
      const { ds } = this
      ds.actions.GENERATE_INTERSECT_MUTLTI_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onIntersectTwoClick() {
      const { ds } = this
      ds.actions.GENERATE_INTERSECT_TWO_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onSubtractClick() {
      const { ds } = this
      ds.actions.GENERATE_SUBTRACT_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onSubtractMultiClick() {
      const { ds } = this
      ds.actions.GENERATE_SUBTRACT_MULTI_OPERATION_WITH_SELECTED_NODES()
      ds.render()
    },
    onSubSetClick() {
      const { ds } = this
      ds.actions.GENERATE_OPERATION_WITH_SELECTED_NODES( 'SUBSET' )
      ds.render()
    },
    onExportClick() {
      this.ds.exportData()
    },
    onDeleteClick() {
      const { ds } = this
      ds.actions.DELETE_SELECTED_DS_ELEMENTS()
      ds.render()
    },
    onTestClick() {
      const { ds } = this
      console.log( ds.store.formatter.finalResultNode.id )
    },

    onImportChange( event ) {
      try {
        const reader = new FileReader()
        
        reader.onload = event => {
          const { result } = event.target
          this.ds.importData( result )
        }
        reader.readAsText( event.target.files[ 0 ] )
      } catch ( e ) {}
    },
  },
}
</script>

<style scoped>
.TheToolbar {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 10px;
  background: rgba(41, 50, 64, 0.6);
  box-shadow: 0 2px 10px 0 rgba(12, 22, 37, 0.5);
}

.importInputLabel {
  color: white;
  margin: 5px 0;
  display: inline-flex;
  padding: 5px 15px;
  border-radius: 100px;
  font-size: 14px;
  text-align: center;
  font-size:14px;
  border: 1px solid rgba(84,188,197,0.80);
  cursor: pointer;
}

.importInput {
  display: none
}

#sourceDataNode {
  margin: 0 0 0 10px;
  padding: 6px;
  font-size: 14px;
  color: white;
  background: rgba(84,188,197);
  /* border: 1px solid grey; */
  cursor: default;
}
</style>

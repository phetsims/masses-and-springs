// Copyright 2016-2021, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { VBox } from '../../../../scenery/js/imports.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import OneSpringScreenView from '../../common/view/OneSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';
import VectorVisibilityControlNode from '../../vectors/view/VectorVisibilityControlNode.js';
import PeriodTraceNode from './PeriodTraceNode.js';

class LabScreenView extends OneSpringScreenView {

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem, {
      useSliderLabels: false,
      dampingVisible: true
    } );
    const vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 30,
        showForces: false
      } );

    // Contains visibility options for the reference lines and displacement arrow
    const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, true, tandem );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        vectorVisibilityControlNode
      ]
    } );

    // @protected {PeriodTraceNode}
    this.periodTraceNode = new PeriodTraceNode( model.firstSpring.periodTrace, this.modelViewTransform, {
      center: this.massEquilibriumLineNode.center
    } );
    this.addChild( this.periodTraceNode );
    this.periodTraceNode.moveToBack();

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( { children: [ optionsPanel, this.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    this.visibleBoundsProperty.link( () => {
      rightPanelsVBox.rightTop = new Vector2( this.panelRightSpacing, this.energyGraphAccordionBox.top );
    } );

    this.shelf.rectWidth = 160;
    this.shelf.left = this.energyGraphAccordionBox.right + this.spacing;

    // Move tools layer so ruler is always in front.
    this.toolsLayer.moveToFront();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();
  }

  /**
   * @param {number} dt
   * @public
   * @overrides
   */
  step( dt ) {
    super.step( dt );
    this.periodTraceNode.step( dt, this.model.playingProperty );
  }
}

massesAndSprings.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
// Copyright 2016-2020, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import OneSpringScreenView from '../../common/view/OneSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';
import VectorVisibilityControlNode from '../../vectors/view/VectorVisibilityControlNode.js';
import PeriodTraceNode from './PeriodTraceNode.js';

/**
 * @param {LabModel} model
 * @param {Tandem} tandem
 *
 * @constructor
 */
function LabScreenView( model, tandem ) {

  // Calls common spring view
  OneSpringScreenView.call( this, model, tandem, {
    useSliderLabels: false,
    dampingVisible: true
  } );
  const self = this;

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
  const rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing * 0.9 } );
  this.addChild( rightPanelsVBox );
  rightPanelsVBox.moveToBack();

  this.visibleBoundsProperty.link( function() {
    rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.energyGraphAccordionBox.top );
  } );

  this.shelf.rectWidth = 160;
  this.shelf.left = this.energyGraphAccordionBox.right + this.spacing;

  // Move tools layer so ruler is always in front.
  this.toolsLayer.moveToFront();

  // Move this plane to the back of the scene graph
  this.backgroundDragPlane.moveToBack();
}

massesAndSprings.register( 'LabScreenView', LabScreenView );
inherit( OneSpringScreenView, LabScreenView, {
  /**
   * @param {number} dt
   * @public
   */
  step: function( dt ) {
    this.energyGraphAccordionBox.update();
    this.periodTraceNode.step( dt, this.model.playingProperty );
  }
} );

export default LabScreenView;
// Copyright 2016-2019, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const OneSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringScreenView' );
  const PeriodTraceNode = require( 'MASSES_AND_SPRINGS/lab/view/PeriodTraceNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const VectorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlNode' );

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
    var self = this;

    var vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 30,
        showForces: false
      } );

    // Contains visibility options for the reference lines and displacement arrow
    var indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, true, tandem );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
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
    var optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    var rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing * 0.9 } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    this.visibleBoundsProperty.link( function() {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.energyGraphNode.top );
    } );

    this.shelf.rectWidth = 160;
    this.shelf.left = this.energyGraphNode.right + this.spacing;

    // Move tools layer so ruler is always in front.
    this.toolsLayer.moveToFront();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();
  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );
  return inherit( OneSpringScreenView, LabScreenView, {
    /**
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      this.energyGraphNode.update();
      this.periodTraceNode.step( dt, this.model.playingProperty );
    }
  } );
} );
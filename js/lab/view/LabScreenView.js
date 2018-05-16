// Copyright 2016-2018, University of Colorado Boulder

/**
 * Screen view used for lab screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PeriodTraceNode = require( 'MASSES_AND_SPRINGS/lab/view/PeriodTraceNode' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var OneSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringScreenView' );
  var VectorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringScreenView.call( this, model, tandem, {
      gravityHSlider: false,
      dampingVisible: true
    } );
    var self = this;

    // @protected {PeriodTraceNode}
    this.periodTraceNode = new PeriodTraceNode( model.periodTrace, this.modelViewTransform, {
      center: this.springEquilibriumLineNode.center
    } );
    this.addChild( this.periodTraceNode );

    var vectorVisibilityControlNode = new VectorVisibilityControlNode(
      model,
      tandem.createTandem( 'vectorVisibilityControlNode' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        showForces: false
      }
    );

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

    // Panel that will display all the toggleable options.
    var optionsPanel = this.createOptionsPanel( optionsVBox, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolBox
    var rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    this.visibleBoundsProperty.link( function( ) {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.energyGraphNode.top );
    } );

    this.shelf.rectWidth = 160;
    this.shelf.left = this.energyGraphNode.right + this.spacing;
  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );
  return inherit( OneSpringScreenView, LabScreenView, {
    step: function( dt ) {
      this.energyGraphNode.update();
      this.periodTraceNode.step( dt, this.model.playingProperty );
    }
  } );
} );
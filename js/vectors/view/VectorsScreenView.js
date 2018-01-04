// Copyright 2016-2017, University of Colorado Boulder

/**
 * Common screen view for vectors screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlPanel' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsScreenView( model, tandem ) {

    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    this.massNodes.forEach( function( massNode ) {
      massNode.vectorViewEnabled = true;
    } );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        top: this.spacing,
        right: this.rightPanelAlignment,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );
    this.addChild( indicatorVisibilityControlPanel );

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    // Displacement arrows added for each springs
    var firstDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].spring.displacementProperty,
      model.displacementVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    firstDisplacementArrowNode.left = this.springNodes[ 0 ].right;
    firstDisplacementArrowNode.top = this.springNodes[ 0 ].bottom;
    this.addChild( firstDisplacementArrowNode );

    var secondDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 1 ].spring.displacementProperty,
      model.displacementVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    secondDisplacementArrowNode.right = this.springNodes[ 1 ].left + secondDisplacementArrowNode.width / 2;
    secondDisplacementArrowNode.top = this.springNodes[ 1 ].bottom;
    this.addChild( secondDisplacementArrowNode );

    this.toolboxPanel.top = vectorVisibilityControlPanel.bottom + this.spacing;

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      indicatorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
      self.gravityAndDampingControlPanel.top = indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
      vectorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
      vectorVisibilityControlPanel.top = self.gravityAndDampingControlPanel.bottom + self.spacing;
      self.gravityAndDampingControlPanel.top = indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
      self.toolboxPanel.top = vectorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
    } );
    this.gravityAndDampingControlPanel.gravityNumberDisplay.visible = false;

    // Determines where we want the force vectors of the attached mass to be placed.
    model.springs[ 0 ].options.forcesOrientation = -1;
    model.springs[ 1 ].options.forcesOrientation = 1;
  }

  massesAndSprings.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( TwoSpringView, VectorsScreenView );
} );

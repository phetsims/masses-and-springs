// Copyright 2016-2017, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vector/view/VectorVisibilityControlPanel' );

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorScreenView( model, tandem ) {

    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    this.massNodes.forEach( function( massNode ) {
      massNode.vectorViewEnabled = true;
    } );

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.gravityAndDampingControlPanel.bottom + this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    this.toolboxPanel.top = vectorVisibilityControlPanel.bottom + this.spacing;

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      vectorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
    } );
    this.gravityAndDampingControlPanel.gravityNumberDisplay.visible = false;
  }

  massesAndSprings.register( 'VectorScreenView', VectorScreenView );

  return inherit( TwoSpringView, VectorScreenView );
} );

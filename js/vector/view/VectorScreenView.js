// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
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

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.gravityAndFrictionControlPanel.bottom + this.spacing,
        left: this.secondSpringConstantControlPanel.right + 10,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    this.toolboxPanel.top = vectorVisibilityControlPanel.bottom + this.spacing;
  }

  massesAndSprings.register( 'VectorScreenView', VectorScreenView );

  return inherit( TwoSpringView, VectorScreenView );
} );

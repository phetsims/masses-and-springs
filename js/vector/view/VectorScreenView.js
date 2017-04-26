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
        top: this.gravityControlPanel.bottom + this.topSpacing,
        left: this.secondSpringConstantControlPanel.right + 10,
        maxWidth: 180
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    this.toolboxPanel.top = vectorVisibilityControlPanel.bottom + this.topSpacing;
  }

  massesAndSprings.register( 'VectorScreenView', VectorScreenView );

  return inherit( TwoSpringView, VectorScreenView );
} );

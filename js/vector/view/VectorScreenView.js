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
   * @constructor
   */
  function VectorScreenView( model, tandem ) {
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    // TODO: Change this value to the bottom of the vectorVisibilityControlPanel + spacing
    this.toolboxPanel.top = 350;

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.gravityControlPanel.bottom + this.topSpacing,
        left: self.secondSpringConstantControlPanel.right + 10,
        maxWidth: 180
      }
    );
    this.addChild( vectorVisibilityControlPanel );
  }

  massesAndSprings.register( 'VectorScreenView', VectorScreenView );

  return inherit( TwoSpringView, VectorScreenView );
} );
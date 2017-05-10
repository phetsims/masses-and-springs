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
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vector/view/VectorVisibilityControlPanel' );

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function LabScreenView( model, tandem ) {
    // Calls common two spring view
    OneSpringView.call( this, model, tandem );

    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ),
      {
        top: this.toolboxPanel.bottom +55 ,
        left: this.gravityControlPanel.left ,
        maxWidth: 180,
        showForces: false
      }
    );
    this.addChild( vectorVisibilityControlPanel );
    vectorVisibilityControlPanel.moveToBack();

    // Unique attributes of screen added here...
  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );

  return inherit( OneSpringView, LabScreenView );
} );
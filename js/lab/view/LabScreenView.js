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

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function LabScreenView( model, tandem ) {
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Unique attributes of screen added here...
  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );

  return inherit( TwoSpringView, LabScreenView );
} );
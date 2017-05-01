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

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function LabScreenView( model, tandem ) {
    // Calls common two spring view
    OneSpringView.call( this, model, tandem );

    // Unique attributes of screen added here...
  }

  massesAndSprings.register( 'LabScreenView', LabScreenView );

  return inherit( OneSpringView, LabScreenView );
} );
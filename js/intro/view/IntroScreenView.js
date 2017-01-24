// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 * @author Denzell Barnett
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
  function IntroScreenView( model ) {
    // Calls common two spring view
    TwoSpringView.call( this, model );

    // Unique attributes of screen added here...
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );
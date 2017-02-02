// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var IntroScreenView = require( 'MASSES_AND_SPRINGS/intro/view/IntroScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );

  // strings
  var introString = require( 'string!MASSES_AND_SPRINGS/intro' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: introString,
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new MassesAndSpringsModel(); },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  massesAndSprings.register( 'IntroScreen', IntroScreen );
  return inherit( Screen, IntroScreen );
} );

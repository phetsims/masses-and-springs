// Copyright 2016, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
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
  var Color = require( 'SCENERY/util/Color' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var introString = require( 'string!MASSES_AND_SPRINGS/intro' );

  /**
   * @param {Tandem} tandem
   * 
   * @constructor
   */
  function IntroScreen( tandem ) {

    var options = {
      name: introString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioValueType: TColor( new Color( 'white' ) )
      } ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new MassesAndSpringsModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new IntroScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'IntroScreen', IntroScreen );
  return inherit( Screen, IntroScreen );
} );

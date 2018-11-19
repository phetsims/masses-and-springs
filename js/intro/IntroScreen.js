// Copyright 2016-2018, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'MASSES_AND_SPRINGS/intro/model/IntroModel' );
  var IntroScreenView = require( 'MASSES_AND_SPRINGS/intro/view/IntroScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!MASSES_AND_SPRINGS/screen.intro' );

  // image
  var introHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/intro_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function IntroScreen( tandem ) {

    var options = {
      name: screenIntroString,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new Image( introHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new IntroModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new IntroScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'IntroScreen', IntroScreen );
  return inherit( Screen, IntroScreen );
} );

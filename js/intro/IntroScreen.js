// Copyright 2016-2018, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const IntroModel = require( 'MASSES_AND_SPRINGS/intro/model/IntroModel' );
  const IntroScreenView = require( 'MASSES_AND_SPRINGS/intro/view/IntroScreenView' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIntroString = require( 'string!MASSES_AND_SPRINGS/screen.intro' );

  // image
  const introHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/intro_screen_icon.png' );

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

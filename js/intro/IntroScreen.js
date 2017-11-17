// Copyright 2016-2017, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorIO = require( 'SCENERY/util/ColorIO' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'MASSES_AND_SPRINGS/intro/model/IntroModel' );
  var IntroScreenView = require( 'MASSES_AND_SPRINGS/intro/view/IntroScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var introString = require( 'string!MASSES_AND_SPRINGS/intro' );

  // image
  var introHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/intro_screen_icon.png' );

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
        phetioType: PropertyIO( ColorIO ),
        maxDT: 1
      } ),
      homeScreenIcon: new Image( introHomeScreenImage ),
      navigationBarIcon: new Image( introHomeScreenImage ),
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

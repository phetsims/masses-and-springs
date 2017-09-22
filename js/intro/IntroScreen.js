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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'MASSES_AND_SPRINGS/intro/model/IntroModel' );
  var IntroScreenView = require( 'MASSES_AND_SPRINGS/intro/view/IntroScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var introString = require( 'string!MASSES_AND_SPRINGS/intro' );

  // image
  var introHomescreenImage = require( 'image!MASSES_AND_SPRINGS/game-home-screen.png' );
  var introNavbarImage = require( 'image!MASSES_AND_SPRINGS/game-nav-bar.png' );

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
        phetioValueType: TColor,
        maxDT: 1
      } ),
      homeScreenIcon: new Image( introHomescreenImage ),
      navigationBarIcon: new Image( introNavbarImage ),
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

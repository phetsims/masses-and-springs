// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'MASSES_AND_SPRINGS/lab/model/LabModel' );
  var LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var labString = require( 'string!MASSES_AND_SPRINGS/lab' );

  // image
  var labHomescreenImage = require( 'image!MASSES_AND_SPRINGS/game-home-screen.png' );
  var labNavbarImage = require( 'image!MASSES_AND_SPRINGS/game-nav-bar.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreen( tandem ) {

    var options = {
      name: labString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioValueType: TColor,
        maxDT: 1
      } ),
      homeScreenIcon: new Image( labHomescreenImage ),
      navigationBarIcon: new Image( labNavbarImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new LabModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new LabScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );

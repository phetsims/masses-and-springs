// Copyright 2016-2019, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Screen = require( 'JOIST/Screen' );
  var VectorsScreenView = require( 'MASSES_AND_SPRINGS/vectors/view/VectorsScreenView' );

  // strings
  var screenVectorsString = require( 'string!MASSES_AND_SPRINGS/screen.vectors' );

  // image
  var vectorHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/vectors_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function VectorsScreen( tandem ) {

    var options = {
      name: screenVectorsString,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new Image( vectorHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        var modelTandem = tandem.createTandem( 'model' );
        var model = new MassesAndSpringsModel( modelTandem );
        model.basicsVersion = false;
        model.addDefaultSprings( modelTandem );
        model.addDefaultMasses( modelTandem );
        return model;
      },
      function( model ) { return new VectorsScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'VectorsScreen', VectorsScreen );

  return inherit( Screen, VectorsScreen );
} );

// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var VectorModel = require( 'MASSES_AND_SPRINGS/vector/model/VectorModel' );
  var VectorScreenView = require( 'MASSES_AND_SPRINGS/vector/view/VectorScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var vectorString = require( 'string!MASSES_AND_SPRINGS/vector' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function VectorScreen( tandem ) {

    var options = {
      name: vectorString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioValueType: TColor,
        maxDT: 1
      } ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new VectorModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new VectorScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'VectorScreen', VectorScreen );

  return inherit( Screen, VectorScreen );
} );

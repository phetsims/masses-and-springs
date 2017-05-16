// Copyright 2016-2017, University of Colorado Boulder

/**
 * Vector model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function VectorModel( tandem ) {
    MassesAndSpringsModel.call( this, tandem, { springCount: 2, showVectors: true } );
  }

  massesAndSprings.register( 'VectorModel', VectorModel );

  return inherit( MassesAndSpringsModel, VectorModel );
} );

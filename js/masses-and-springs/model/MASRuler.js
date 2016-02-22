// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */

define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Vector2} position
   * @constructor
   */
  function MASRuler( position ) {
    PropertySet.call( this, {
      position: position
    } );
  }

  massesAndSprings.register( 'MASRuler', MASRuler );

  return inherit( PropertySet, MASRuler );

} );
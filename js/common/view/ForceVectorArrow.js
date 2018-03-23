// Copyright 2017-2018, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  /**
   * @param {Color} color
   * @constructor
   */
  function ForceVectorArrow( color ) {
    ArrowNode.call( this, 5, 0, 31, 0, {
      fill: color,
      stroke: color,
      centerY: 0,
      tailWidth: 3,
      headWidth: 11
    } );
  }

  massesAndSprings.register( 'ForceVectorArrow', ForceVectorArrow );
  return inherit( ArrowNode, ForceVectorArrow );
} );

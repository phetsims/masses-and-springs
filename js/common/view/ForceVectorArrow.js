// Copyright 2017-2019, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

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
      headWidth: 11,
      pickable: false
    } );
  }

  massesAndSprings.register( 'ForceVectorArrow', ForceVectorArrow );

  return inherit( ArrowNode, ForceVectorArrow );
} );

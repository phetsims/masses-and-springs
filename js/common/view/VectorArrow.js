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

  // Constants REVIEW: All used once, just inline?
  var VECTOR_ARROW_LENGTH = 34;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;

  /**
   * @param {Color} color
   * @constructor
   */
  // REVIEW: We are creating different arrows. Should we have to pass in the tandem and tandem ID separately?
  function VectorArrow( color ) {
    ArrowNode.call( this, 10, 0, VECTOR_ARROW_LENGTH, 0, {
      fill: color,
      stroke: 'black',
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
  }

  massesAndSprings.register( 'VectorArrow', VectorArrow );
  return inherit( ArrowNode, VectorArrow );
} );

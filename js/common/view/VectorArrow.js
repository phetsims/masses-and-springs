// Copyright 2017, University of Colorado Boulder

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

  // Constants
  // TODO:Merge some of these into a constants file
  var VECTOR_ARROW_LENGTH = 34;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;

  /**
   * @param {Color} color
   * @param {string} tandemID - string name of tandem
   * @param {Tandem} tandem
   * @constructor
   */
  // REVIEW: We are creating different arrows. Should we have to pass in the tandem and tandem ID separately?
  function VectorArrow( color, tandemID, tandem ) {
    ArrowNode.call( this, 10, 0, VECTOR_ARROW_LENGTH, 0, {
      fill: color,
      stroke: 'black',
      centerY: 0,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH,
      renderer: 'canvas',
      tandem: tandem.createTandem( tandemID )
    } );
  }

  massesAndSprings.register( 'VectorArrow', VectorArrow );
  return inherit( ArrowNode, VectorArrow );
} );

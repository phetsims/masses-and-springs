// Copyright 2016-2017, University of Colorado Boulder

/**
 *
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
  var FORCES_ARROW_LENGTH = 31;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;
  var SMALLER_ARROW_HEAD_WIDTH = 11;
  var SMALLER_ARROW_TAIL_WIDTH = 3;

  /**
   * @param {string} type - type of arrow to be displayed, 'vector' or 'force'
   * @param {Color} color
   * @param {string} tandemID - string name of tandem
   * @param {Tandem} tandem
   * @constructor
   */
  // REVIEW: We are creating different arrows. Should we have to pass in the tandem and tandem ID separately?
  function ArrowNodeCreator( type, color, tandemID, tandem ) {

    if ( type === 'vector' ) {
      ArrowNode.call( this, 10, 0, VECTOR_ARROW_LENGTH, 0, {
        fill: color,
        stroke: 'black',
        centerY: 0,
        tailWidth: ARROW_TAIL_WIDTH,
        headWidth: ARROW_HEAD_WIDTH,
        tandem: tandem.createTandem( tandemID )
      } );
    }
    else if ( type === 'force' ) {
      ArrowNode.call( this, 5, 0, FORCES_ARROW_LENGTH, 0, {
        fill: color,
        stroke: color,
        centerY: 0,
        tailWidth: SMALLER_ARROW_TAIL_WIDTH,
        headWidth: SMALLER_ARROW_HEAD_WIDTH,
        tandem: tandem.createTandem( tandemID )
      } );
    }
  }

  massesAndSprings.register( 'ArrowNodeCreator', ArrowNodeCreator );
  return inherit( ArrowNode, ArrowNodeCreator );
} );

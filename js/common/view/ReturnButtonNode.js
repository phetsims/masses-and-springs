// Copyright 2014-2015, University of Colorado Boulder

/**
 * Responsible for the return button, which resets the mass and spring positions.
 *
 * @author Denzell Barnett
 */

/**
 * Return button node in 'Pendulum Lab' simulation.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var returnString = require( 'string!MASSES_AND_SPRINGS/return' );

  // constants
  var FONT = new PhetFont( 12 );

  /**
   * Constructor for return button
   *
   * @param {Object} [options]
   * @constructor
   */
  function ReturnButtonNode( options ) {
    TextPushButton.call( this, returnString, _.extend( {
      font: FONT,
      baseColor: 'rgb( 231, 232, 233 )',
      touchAreaXDilation: 10,
      touchAreaYDilation: 6
    }, options ) );
  }

  massesAndSprings.register( 'ReturnButtonNode', ReturnButtonNode );

  return inherit( TextPushButton, ReturnButtonNode );
} );
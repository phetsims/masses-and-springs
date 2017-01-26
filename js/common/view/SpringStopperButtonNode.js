// Copyright 2014-2015, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Spring stopper button that stops a specific spring from oscillating.
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );

  // strings
  var returnString = require( 'string!MASSES_AND_SPRINGS/return' );


  /**
   * Constructor for return button
   * @param {massesAndSprings} model
   * @param {number} springNumber
   * @param {Object} [options]
   * @constructor
   */
  function SpringStopperButtonNode( options ) {
    CloseButton.call( this, returnString, _.extend( {
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }, options ) );
    this.mutate( options );
  }

  massesAndSprings.register( 'SpringStopperButtonNode', SpringStopperButtonNode );

  return inherit( CloseButton, SpringStopperButtonNode );
} );
// Copyright 2016-2017, University of Colorado Boulder

/**
 * Object that creates the grey bar that a signle spring hangs from.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function SingleSpringHangerNode( tandem ) {

    // derived from x positions of springs.
    Rectangle.call( this, 0, 0, 48, 20, 8, 8, {
      fill: 'rgb( 180, 180, 180 )',
      stroke: 'grey',
      tandem: tandem
    } );
  }

  massesAndSprings.register( 'SingleSpringHangerNode', SingleSpringHangerNode );

  return inherit( Rectangle, SingleSpringHangerNode );
} );
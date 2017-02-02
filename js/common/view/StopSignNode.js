// Copyright 2014-2015, University of Colorado Boulder

/**
 * StopSignNode used to send springs back to equilibrium
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Vector2} start
   * @param {number} width the distance the wire extends beyond the flashlight before turning up to the slider
   * @constructor
   */
  function StopSignNode( start, width ) {

    var signShape = new Shape()
      .moveTo( start.x, start.y )
      .lineTo( start.x + width, start.y )
      .lineTo( start.x + width * 1.5, start.y - width * .5 )
      .lineTo( start.x + width * 1.5, start.y - width * 1.5 )
      .lineTo( start.x + width, start.y - width * 2 )
      .lineTo( start.x, start.y - width * 2 )
      .lineTo( start.x - width * .5, start.y - width * 1.5 )
      .lineTo( start.x - width * .5, start.y - width * .5 )
      .lineTo( start.x, start.y );

    Path.call( this, signShape, {
      lineWidth: 1,
      stroke: '#999999',
      fill: 'red',
      lineJoin: 'round',
      lineColor: 'blue'
    } );
  }

  massesAndSprings.register( 'StopSignNode', StopSignNode );

  return inherit( Path, StopSignNode );
} );

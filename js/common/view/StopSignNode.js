// Copyright 2014-2015, University of Colorado Boulder

/**
 * StopSignNode used to send springs to equilibrium position
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
   * @param {number} width the distance the wire extends beyond the flashlight before turning up to the slider
   * @constructor
   */
  function StopSignNode( width ) {
    var initialXPosition = width / 4;
    var signShape = new Shape()
      .moveTo( initialXPosition, width )
      .lineTo( initialXPosition + width, width )
      .lineTo( initialXPosition + width * 1.5, width - width * .5 )
      .lineTo( initialXPosition + width * 1.5, width - width * 1.5 )
      .lineTo( initialXPosition + width, width - width * 2 )
      .lineTo( initialXPosition, width - width * 2 )
      .lineTo( initialXPosition - width * .5, width - width * 1.5 )
      .lineTo( initialXPosition - width * .5, width - width * .5 )
      .lineTo( initialXPosition, width );

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

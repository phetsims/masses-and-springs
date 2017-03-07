// Copyright 2017, University of Colorado Boulder

/**
 * An octagonal, red stop sign node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/node\s/Path' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} options
   * @constructor
   */
  function StopSignNode( options ) {
    options = _.extend( {
      width: 7,
      lineWidth: 1,
      stroke: '#999999',
      fill: 'red',
      lineJoin: 'round',
      lineColor: 'blue',
      tandem: Tandem.tandemRequired()
    }, options );

    // TODO: All widths should be divided by 2 below
    var width = options.width;
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

    Path.call( this, signShape, options );
  }

  massesAndSprings.register( 'StopSignNode', StopSignNode );

  return inherit( Path, StopSignNode );
} );
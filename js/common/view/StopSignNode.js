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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} options
   * @constructor
   */
  function StopSignNode( options ) {
    options = _.extend( {
      radius: 9,
      lineWidth: 1,
      stroke: '#999999',
      fill: 'red',
      lineJoin: 'round',
      lineColor: 'blue',
      tandem: Tandem.tandemRequired(),
      rotation: Math.PI / 4 / 2
    }, options );

    var signShape = Shape.regularPolygon( 8, options.radius );

    Path.call( this, signShape, options );
  }

  massesAndSprings.register( 'StopSignNode', StopSignNode );

  return inherit( Path, StopSignNode );
} );
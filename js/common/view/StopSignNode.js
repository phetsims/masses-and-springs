// Copyright 2017, University of Colorado Boulder

/**
 * An octagonal, red stop sign node with a white internal border
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Node = require( 'SCENERY/nodes/Node' )

  /**
   * @param {Object} options
   * @constructor
   */
  function StopSignNode( options ) {

    options = _.extend( {
      whiteStrokeRadius: 2,
      blackStrokeRadius: 1,
      redRadius: 23,
      innerFill: 'red',
      whiteFill: 'white',
      blackFill: 'black',
      tandem: Tandem.tandemRequired()
    }, options );
    var createStopSignPath = function( fill, radius ) {
      return new Path( Shape.regularPolygon( 8, radius ), {
        fill: fill,
        rotation: Math.PI / 8,

        // To support centering when stacked in z-order
        centerX: 0,
        centerY: 0
      } );
    };
    options.children = [
      createStopSignPath( options.blackFill, options.redRadius + options.whiteStrokeRadius + options.blackStrokeRadius ),
      createStopSignPath( options.whiteFill, options.redRadius + options.whiteStrokeRadius ),
      createStopSignPath( options.innerFill, options.redRadius )
    ];

    Node.call( this, options );
  }

  massesAndSprings.register( 'StopSignNode', StopSignNode );

  return inherit( Node, StopSignNode );
} );
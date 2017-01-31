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
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StopSignNode = require( 'MASSES_AND_SPRINGS/common/view/StopSignNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for return button
   * @param {Object} [options]
   * @constructor
   */
  function SpringStopperButtonNode( options ) {
    options = _.extend( {
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      baseColor: 'rgb( 240, 240, 240 )',
      content: new StopSignNode( new Vector2( 200, 200 ), 9 )
    }, options );
    RectangularPushButton.call( this, options );
  }

  massesAndSprings.register( 'SpringStopperButtonNode', SpringStopperButtonNode );

  return inherit( RectangularPushButton, SpringStopperButtonNode );
} );
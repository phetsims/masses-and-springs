// Copyright 2014-2017, University of Colorado Boulder

/**
 * Spring stopper button that stops a specific spring from oscillating.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StopSignNode = require( 'MASSES_AND_SPRINGS/common/view/StopSignNode' );

  /**
   * Constructor for return button
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SpringStopperButtonNode( tandem, options ) {
    options = _.extend( {
      xMargin: 3,
      yMargin: 3,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      baseColor: 'rgb( 240, 240, 240 )',
      content: new StopSignNode( {
        tandem: tandem.createTandem( 'stopSignNode' ),
        scale: 0.33
      } ),
      tandem: tandem
    }, options );
    RectangularPushButton.call( this, options );
  }

  massesAndSprings.register( 'SpringStopperButtonNode', SpringStopperButtonNode );

  return inherit( RectangularPushButton, SpringStopperButtonNode );
} );
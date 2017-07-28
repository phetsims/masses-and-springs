// Copyright 2014-2017, University of Colorado Boulder

// REVIEW: This button isn't specific to stopping the springs.  I (jbphet) would suggest changing the name to
// StopButtonNode and updating the documentation, then someone could just grab it if they wanted to reuse it.
/**
 * Spring stopper button that stops a specific spring from oscillating.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var StopSignNode = require( 'SCENERY_PHET/StopSignNode' );

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
      baseColor: MassesAndSpringsConstants.PANEL_FILL,
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
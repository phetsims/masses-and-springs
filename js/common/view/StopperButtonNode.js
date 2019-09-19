// Copyright 2017, University of Colorado Boulder

/**
 * Button that stops a specific spring from oscillating.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const StopSignNode = require( 'SCENERY_PHET/StopSignNode' );

  /**
   * Constructor for return button
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function StopperButtonNode( tandem, options ) {
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

  massesAndSprings.register( 'StopperButtonNode', StopperButtonNode );

  return inherit( RectangularPushButton, StopperButtonNode );
} );
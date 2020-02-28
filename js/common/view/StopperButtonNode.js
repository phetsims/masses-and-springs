// Copyright 2017-2020, University of Colorado Boulder

/**
 * Button that stops a specific spring from oscillating.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StopSignNode from '../../../../scenery-phet/js/StopSignNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

/**
 * Constructor for return button
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function StopperButtonNode( tandem, options ) {
  options = merge( {
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

inherit( RectangularPushButton, StopperButtonNode );
export default StopperButtonNode;
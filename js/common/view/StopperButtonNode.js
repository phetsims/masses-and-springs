// Copyright 2017-2020, University of Colorado Boulder

/**
 * Button that stops a specific spring from oscillating.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import StopSignNode from '../../../../scenery-phet/js/StopSignNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

class StopperButtonNode extends RectangularPushButton {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {

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

    super( options );
  }
}

massesAndSprings.register( 'StopperButtonNode', StopperButtonNode );
export default StopperButtonNode;
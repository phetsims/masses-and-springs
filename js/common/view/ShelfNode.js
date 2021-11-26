// Copyright 2017-2021, University of Colorado Boulder

/**
 * Shelf used to house the masses when they are not being dragged or attached to a spring
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import massesAndSprings from '../../massesAndSprings.js';

class ShelfNode extends Rectangle {
  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    options = merge( {
      fill: '#e6c29a',
      stroke: 'black',
      rectHeight: 10,
      rectX: 6,
      rectWidth: 280,
      tandem: tandem
    }, options );
    super( options );
  }
}

massesAndSprings.register( 'ShelfNode', ShelfNode );

export default ShelfNode;